import random
from datetime import timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand
from university.models import CourseUnit, Class
from exchange.models import (
    UserCourseUnits, 
    MarketplaceExchange, 
    MarketplaceExchangeClass,
    DirectExchange,
    DirectExchangeParticipants,
    ExchangeUrgentRequests,
    ExchangeUrgentRequestOptions,
    ExchangeAdmin,
    ExchangeExpirations,
    CourseUnitEnrollments,
    CourseUnitEnrollmentOptions
)

class Command(BaseCommand):
    help = 'Generates robust mock data for exchange requests in LEIC and MEIC'

    def handle(self, *args, **kwargs):
        self.stdout.write("Cleaning up old mock data...")
        
        # We clean up ALL exchange requests from the dev database to start fresh
        # Since the models use DO_NOTHING, we must delete child records manually before parents
        DirectExchangeParticipants.objects.all().delete()
        DirectExchange.objects.all().delete()
        
        MarketplaceExchangeClass.objects.all().delete()
        MarketplaceExchange.objects.all().delete()
        
        ExchangeUrgentRequestOptions.objects.all().delete()
        ExchangeUrgentRequests.objects.all().delete()
        
        CourseUnitEnrollmentOptions.objects.all().delete()
        CourseUnitEnrollments.objects.all().delete()
        
        # For UserCourseUnits, we ONLY delete the fake ones (NMECs ending in "999") 
        # so we don't accidentally delete your personal test account enrollments!
        UserCourseUnits.objects.filter(user_nmec__endswith="999").delete()

        # Reset SQLite auto-increment sequences so IDs start from 1 again
        from django.db import connection
        with connection.cursor() as cursor:
            if connection.vendor == 'sqlite':
                tables_to_reset = [
                    'direct_exchange_participants', 'direct_exchange',
                    'marketplace_exchange_class', 'marketplace_exchange',
                    'exchange_urgent_request_options', 'exchange_urgent_requests',
                    'course_unit_enrollment_options', 'course_unit_enrollments'
                ]
                for table in tables_to_reset:
                    try:
                        cursor.execute(f"DELETE FROM sqlite_sequence WHERE name='{table}';")
                    except Exception:
                        pass

        self.stdout.write("Finding LEIC and MEIC course units with classes...")
        valid_cus = []
        for cu in CourseUnit.objects.filter(course__acronym__in=['L.EIC', 'M.EIC', 'LEIC', 'MEIC']):
            classes = list(Class.objects.filter(course_unit=cu))
            if len(classes) >= 2:
                valid_cus.append({'cu': cu, 'classes': classes})

        if not valid_cus:
            self.stdout.write(self.style.ERROR("No valid Course Units with classes found for LEIC/MEIC!"))
            return

        self.stdout.write(f"Found {len(valid_cus)} valid Course Units. Generating fake students...")
        
        first_names = ["António", "João", "Maria", "Francisca", "José", "Pedro", "Tiago", "Inês", "Mariana", "Beatriz", "Diogo", "Rui", "Catarina", "Rita", "Miguel"]
        last_names = ["Silva", "Santos", "Ferreira", "Pereira", "Oliveira", "Costa", "Rodrigues", "Martins", "Gomes", "Fernandes"]
        
        students = []
        for i in range(1, 501):
            year = random.choice([2021, 2022, 2023, 2024])
            # We add '999' at the end to identify fake users easily: e.g. 202245999
            nmec = f"{year}{random.randint(10, 99)}999"
            name = f"{random.choice(first_names)} {random.choice(last_names)} (MockUser)"
            students.append({"nmec": nmec, "name": name})
        
        # 1. ENROLL STUDENTS
        for student in students:
            for cu_data in valid_cus:
                if random.random() < 0.8:
                    random_class = random.choice(cu_data['classes'])
                    UserCourseUnits.objects.create(
                        user_nmec=student["nmec"],
                        course_unit=cu_data['cu'],
                        class_field=random_class
                    )

        self.stdout.write("Students enrolled. Generating Marketplace Exchanges...")
        
        # 2. MARKETPLACE EXCHANGES
        for _ in range(500):
            student = random.choice(students)
            enrollments = list(UserCourseUnits.objects.filter(user_nmec=student["nmec"]))
            if not enrollments: continue
            
            enrollment = random.choice(enrollments)
            cu = enrollment.course_unit
            from_class = enrollment.class_field
            
            other_classes = list(Class.objects.filter(course_unit=cu).exclude(id=from_class.id))
            if not other_classes: continue
            to_class = random.choice(other_classes)
            
            m_exchange = MarketplaceExchange.objects.create(
                issuer_name=student["name"],
                issuer_nmec=student["nmec"],
                accepted=random.choice([True, False, False]),
                canceled=random.choice([True, False, False, False]),
                admin_state=random.choice(["untreated", "accepted", "rejected"]),
                date=timezone.now() - timedelta(days=random.randint(0, 10))
            )
            
            MarketplaceExchangeClass.objects.create(
                marketplace_exchange=m_exchange,
                course_unit_name=cu.name,
                course_unit_acronym=cu.acronym,
                course_unit_id=str(cu.id),
                class_issuer_goes_from=from_class.name,
                class_issuer_goes_to=to_class.name
            )

        self.stdout.write("Generating Direct Exchanges...")
        
        # 3. DIRECT EXCHANGES
        for _ in range(300):
            student1 = random.choice(students)
            student2 = random.choice(students)
            if student1 == student2: continue
            
            s1_enrollments = {e.course_unit.id: e.class_field for e in UserCourseUnits.objects.filter(user_nmec=student1["nmec"])}
            s2_enrollments = {e.course_unit.id: e.class_field for e in UserCourseUnits.objects.filter(user_nmec=student2["nmec"])}
            
            common_cu_ids = set(s1_enrollments.keys()).intersection(set(s2_enrollments.keys()))
            valid_common = [cid for cid in common_cu_ids if s1_enrollments[cid].id != s2_enrollments[cid].id]
            
            if not valid_common: continue
            
            cu_id = random.choice(valid_common)
            cu = CourseUnit.objects.get(id=cu_id)
            c1 = s1_enrollments[cu_id]
            c2 = s2_enrollments[cu_id]
            
            d_exchange = DirectExchange.objects.create(
                issuer_name=student1["name"],
                issuer_nmec=student1["nmec"],
                accepted=random.choice([True, False]),
                canceled=False,
                admin_state=random.choice(["untreated", "accepted", "rejected"]),
                date=timezone.now() - timedelta(days=random.randint(0, 10))
            )
            
            DirectExchangeParticipants.objects.create(
                participant_name=student1["name"],
                participant_nmec=student1["nmec"],
                class_participant_goes_from=c1.name,
                class_participant_goes_to=c2.name,
                course_unit=cu.name,
                course_unit_id=str(cu.id),
                direct_exchange=d_exchange,
                accepted=True
            )
            
            DirectExchangeParticipants.objects.create(
                participant_name=student2["name"],
                participant_nmec=student2["nmec"],
                class_participant_goes_from=c2.name,
                class_participant_goes_to=c1.name,
                course_unit=cu.name,
                course_unit_id=str(cu.id),
                direct_exchange=d_exchange,
                accepted=random.choice([True, False])
            )

        self.stdout.write("Generating Urgent Requests with funny descriptions...")
        
        # 4. URGENT REQUESTS
        funny_messages = [
            "Tenho bué fome a essa hora e dava-me jeito ir almoçar mais cedo senão desmaio nas aulas.",
            "A minha avó tem aulas de zumba e eu tenho de lhe dar boleia às terças-feiras.",
            "O meu cão comeu-me o horário e agora prefiro esta turma porque acordo mais tarde.",
            "O professor da outra turma tem negative aura e eu sou um true sigma male, preciso de trocar.",
            "Não posso ir a esta aula porque coincide com a hora de cobrar as fanum taxes lá em casa.",
            "Esta turma é muito skibidi e eu preciso de uma turma com mais rizzlers.",
            "Bro pls deixa-me trocar, o meu nível de gyatt não aguenta a energia desta turma.",
            "Preciso desta turma para conseguir apanhar o comboio de São Bento a horas.",
            "O meu astrólogo disse que 3ª feira à tarde é péssimo para a minha aura e alinhamento de chakras.",
            "Sou o Batman e tenho de salvar o Porto à noite, as aulas da manhã são impossíveis."
        ]
        
        for _ in range(300):
            student = random.choice(students)
            enrollments = list(UserCourseUnits.objects.filter(user_nmec=student["nmec"]))
            if not enrollments: continue
            
            enrollment = random.choice(enrollments)
            cu = enrollment.course_unit
            from_class = enrollment.class_field
            
            other_classes = list(Class.objects.filter(course_unit=cu).exclude(id=from_class.id))
            if not other_classes: continue
            to_class = random.choice(other_classes)
            
            u_exchange = ExchangeUrgentRequests.objects.create(
                issuer_name=student["name"],
                issuer_nmec=student["nmec"],
                accepted=random.choice([True, False, False]),
                message=random.choice(funny_messages),
                admin_state=random.choice(["untreated", "accepted", "rejected"]),
                date=timezone.now() - timedelta(days=random.randint(0, 10))
            )
            
            ExchangeUrgentRequestOptions.objects.create(
                class_issuer_goes_from=from_class.name,
                class_issuer_goes_to=to_class.name,
                course_unit=cu,
                exchange_urgent_request=u_exchange
            )

        self.stdout.write("Generating Course Unit Enrollments (Pedidos de Inscrição)...")
        
        # 5. ENROLLMENT REQUESTS
        for _ in range(150):
            student = random.choice(students)
            
            # Find a course unit they are NOT enrolled in
            enrolled_cu_ids = UserCourseUnits.objects.filter(user_nmec=student["nmec"]).values_list('course_unit_id', flat=True)
            available_cus = [cu_data for cu_data in valid_cus if cu_data['cu'].id not in enrolled_cu_ids]
            
            if not available_cus: continue
            
            target_cu_data = random.choice(available_cus)
            target_cu = target_cu_data['cu']
            
            c_enrollment = CourseUnitEnrollments.objects.create(
                user_nmec=student["nmec"],
                user_name=student["name"],
                accepted=random.choice([True, False, False]),
                admin_state=random.choice(["untreated", "accepted", "rejected"]),
                date=timezone.now() - timedelta(days=random.randint(0, 10))
            )
            
            # Pick 1 to 3 classes as options for this enrollment request
            num_options = random.randint(1, min(3, len(target_cu_data['classes'])))
            options = random.sample(target_cu_data['classes'], num_options)
            
            for opt_class in options:
                CourseUnitEnrollmentOptions.objects.create(
                    course_unit=target_cu,
                    enrolling=True,
                    course_unit_enrollment=c_enrollment,
                    date=timezone.now()
                )

        self.stdout.write(self.style.SUCCESS("Mock data with real names and funny urgent requests successfully generated!"))
