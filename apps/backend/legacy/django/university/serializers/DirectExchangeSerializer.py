from rest_framework import serializers

from exchange.models import DirectExchangeParticipants

from university.serializers.DirectExchangeParticipantsSerializer import DirectExchangeParticipantsSerializer

class DirectExchangeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.SerializerMethodField()
    issuer_name = serializers.CharField()
    issuer_nmec = serializers.CharField()
    accepted = serializers.BooleanField()
    canceled = serializers.BooleanField()
    admin_state = serializers.CharField()
    options = serializers.SerializerMethodField()
    date = serializers.DateTimeField()

    def get_type(self, obj):
        return "directexchange"

    def get_options(self, obj):
        participants = DirectExchangeParticipants.objects.filter(
            direct_exchange__id=obj.id
        )

        return [
            DirectExchangeParticipantsSerializer(participant).data for participant in participants
        ]
