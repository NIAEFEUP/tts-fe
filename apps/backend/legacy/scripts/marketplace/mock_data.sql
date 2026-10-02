-- Exchange periods — open for all mock course units
INSERT INTO exchange_expirations (course_unit_id, active_date, end_date, is_course_expiration)
SELECT 586999, '2025-09-01', '2027-08-31', 0 WHERE NOT EXISTS (SELECT 1 FROM exchange_expirations WHERE course_unit_id = 586999);
INSERT INTO exchange_expirations (course_unit_id, active_date, end_date, is_course_expiration)
SELECT 587000, '2025-09-01', '2027-08-31', 0 WHERE NOT EXISTS (SELECT 1 FROM exchange_expirations WHERE course_unit_id = 587000);
INSERT INTO exchange_expirations (course_unit_id, active_date, end_date, is_course_expiration)
SELECT 587001, '2025-09-01', '2027-08-31', 0 WHERE NOT EXISTS (SELECT 1 FROM exchange_expirations WHERE course_unit_id = 587001);
INSERT INTO exchange_expirations (course_unit_id, active_date, end_date, is_course_expiration)
SELECT 587002, '2025-09-01', '2027-08-31', 0 WHERE NOT EXISTS (SELECT 1 FROM exchange_expirations WHERE course_unit_id = 587002);
INSERT INTO exchange_expirations (course_unit_id, active_date, end_date, is_course_expiration)
SELECT 587003, '2025-09-01', '2027-08-31', 0 WHERE NOT EXISTS (SELECT 1 FROM exchange_expirations WHERE course_unit_id = 587003);

-- Auth users
INSERT INTO auth_user (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
SELECT '', NULL, 0, '210963', 'João', 'Cansssss', '210963@up.pt', 0, 1, '2026-02-03 22:00:00.000000'
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE username = '210963');

INSERT INTO auth_user (password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
SELECT '', NULL, 0, '424415', 'Augusto', 'Gama', '424415@up.pt', 0, 1, '2026-02-03 22:01:00.000000'
WHERE NOT EXISTS (SELECT 1 FROM auth_user WHERE username = '424415');

-- Admin mock data
INSERT INTO exchange_admin (username)
SELECT '<username>' WHERE NOT EXISTS (SELECT 1 FROM exchange_admin WHERE username = '<username>');
INSERT INTO exchange_admin (username)
SELECT '210963' WHERE NOT EXISTS (SELECT 1 FROM exchange_admin WHERE username = '210963');
INSERT INTO exchange_admin (username)
SELECT '424415' WHERE NOT EXISTS (SELECT 1 FROM exchange_admin WHERE username = '424415');

INSERT INTO exchange_admin_courses (exchange_admin_id, course_id)
SELECT id, 22841 FROM exchange_admin WHERE username = '<username>'
AND NOT EXISTS (SELECT 1 FROM exchange_admin_courses eac JOIN exchange_admin ea ON eac.exchange_admin_id = ea.id WHERE ea.username = '<username>' AND eac.course_id = 22841);

INSERT INTO exchange_admin_courses (exchange_admin_id, course_id)
SELECT id, 22862 FROM exchange_admin WHERE username = '<username>'
AND NOT EXISTS (SELECT 1 FROM exchange_admin_courses eac JOIN exchange_admin ea ON eac.exchange_admin_id = ea.id WHERE ea.username = '<username>' AND eac.course_id = 22862);

INSERT INTO exchange_admin_course_units (exchange_admin_id, course_unit_id)
SELECT id, 587002 FROM exchange_admin WHERE username = '424415'
AND NOT EXISTS (SELECT 1 FROM exchange_admin_course_units eacu JOIN exchange_admin ea ON eacu.exchange_admin_id = ea.id WHERE ea.username = '424415' AND eacu.course_unit_id = 587002);
