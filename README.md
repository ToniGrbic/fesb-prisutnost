# Pokretanje backend

Pokrenuti Docker desktop i u terminal unijeti `make start` ili `docker compose up --build`. Nakon toga će se pokrenuti baza i backend.

# Seedanje profesor usera u db

1. `docker exec <ime_db_container> bash` Ime kontenjera se nalazi u docker desktop-u.
2. ulaz u psql `psql -h localhost -U postgres`
3. spanjanje s bazom `\c postgres`
4. napravit hashiranu lozinku: https://bcrypt-generator.com/ sa rounds = 10
5. Query za unos korisnika (NOTE: promijeni hashed_pass): ```INSERT INTO users (email, role, password, created_at, updated_at)
   VALUES
   ('profesor@example.com', 'manager', '<hashed_pass>', NOW(), NOW());```


# Pokretanje app
1. U terminal unijeti ```yarn install``` i nakon toga ```yarn expo start```
2. Skenirati QR kod iz terminala sa Expo GO app.

