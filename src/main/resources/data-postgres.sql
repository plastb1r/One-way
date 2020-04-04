
INSERT INTO users(user_id, user_name, user_password, user_email, user_phone_number,
    user_expired,user_non_locked,user_credentials_non_expired,user_enable)
VALUES 
  (1,'Tom','c4ca4238a0b923820dcc509a6f75849b','tom123@mail.ru', '88003215465',TRUE,TRUE,TRUE,TRUE),
  (2,'Bob','c81e728d9d4c2f636f067f89cc14862c','bob76@gmail.com', '88345674970',TRUE,TRUE,TRUE,TRUE);

INSERT INTO roles(role_id, role_name, user_id)
VALUES
  (1,'ADMIN',1),
  (2,'USER',2);
  
INSERT INTO cities(city_id,city_name)
VALUES
  (1,'Moscow'),
  (2,'Rome');

INSERT INTO routes(route_id, route_name, route_time_to_go, city_id, user_id)
VALUES
  (1,'route1',1,1,1),
  (2,'route2',2,2,1),
  (3,'route3',2,2,2);

INSERT INTO places(place_id, place_lat,place_lng, user_id)
VALUES
  ('aaaa',12,31,null),
  ('bbbb',13,32,null),
  ('cccc',13,33,null),
  ('dddd',14,34,null),
  ('eeee',14,35,null),
  ('ffff',15,36,null),
  ('zzzz',16,37,null),
  ('ssss',17,38,null),
  ('gggg',18,35,1),
  ('hhhh',19,36,2),
  ('iiii',143,11,2);

INSERT INTO places_on_route(place_on_route_id, place_id, route_id,
    place_index, time_to_next_place, transport_to_next_place)
VALUES 
  (1,'aaaa',1,1,1,1),
  (2,'bbbb',1,2,0,0),
  (3,'cccc',2,1,2,4),
  (4,'dddd',2,2,0,0),
  (5,'eeee',3,1,0.5,2),
  (8,'ffff',3,2,0.5,4),
  (6,'zzzz',3,3,1,2),
  (7,'ssss',3,4,0,0); 