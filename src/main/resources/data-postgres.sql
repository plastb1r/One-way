INSERT INTO users(user_id, user_name, user_password, user_email, user_phone_number)
VALUES 
  (1,'Tom','c4ca4238a0b923820dcc509a6f75849b','tom123@mail.ru', '88003215465'),
  (2,'Bob','c81e728d9d4c2f636f067f89cc14862c','bob76@gmail.com', '88345674970');

INSERT INTO cities(city_id,city_name)
VALUES
(1,'Moscow'),
(2,'Rome');

INSERT INTO routes(route_id, route_name, route_time_to_go, city_id, user_id)
VALUES
  (1,'route1',1,1,1),
  (2,'route2',2,2,1),
  (3,'route3',2,2,2);

INSERT INTO places(place_id, place_coordinates, user_id)
VALUES
  ('aaaa','coordinates1',null),
  ('bbbb','coordinates2',null),
  ('cccc','coordinates3',null),
  ('dddd','coordinates4',null),
  ('eeee','coordinates5',null),
  ('ffff','coordinates6',null),
  ('zzzz','coordinates51',null),
  ('ssss','coordinates61',null),
  ('gggg','coordinates7',1),
  ('hhhh','coordinates8',2),
  ('iiii','coordinates9',2);

INSERT INTO places_on_route(place_on_route_id, place_id, route_id,
            place_index, time_to_next_place, transport_to_next_place)
VALUES 
  (1,'aaaa',1,1,1,1),
  (2,'bbbb',1,2,0,0),
  (3,'cccc',2,1,2,5),
  (4,'dddd',2,2,0,0),
  (5,'eeee',3,1,0.5,2),
  (8,'ffff',3,2,0.5,4),
  (6,'zzzz',3,3,1,5),
  (7,'ssss',3,4,0,0); 