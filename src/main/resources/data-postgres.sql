INSERT INTO users(user_id, user_name, user_password, user_email) VALUES (1,'Tom',1,'tom123@mail.ru');
INSERT INTO users(user_id, user_name, user_password, user_email) VALUES (2,'Bob',2,'bob76@gmail.com');

INSERT INTO routes(route_id, route_name, user_id) VALUES (1,'route1',1);
INSERT INTO routes(route_id, route_name, user_id) VALUES (2,'route2',2);
INSERT INTO routes(route_id, route_name, user_id) VALUES (3,'route3',2);

INSERT INTO places(place_id, route_id, place_index) VALUES ('wewrgdfsi',1,1);
INSERT INTO places(place_id, route_id, place_index) VALUES ('kihjyftgf',1,2);
INSERT INTO places(place_id, route_id, place_index) VALUES ('uighfdljs',1,3);
INSERT INTO places(place_id, route_id, place_index) VALUES ('uhjgdfghr',2,1);
INSERT INTO places(place_id, route_id, place_index) VALUES ('okmfdxhjf',2,2);

-- INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,1,1);
-- INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,2,2);
-- INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,3,3);
-- INSERT INTO route_points(route_id, point_id, point_index) VALUES (2,4,1);
-- INSERT INTO route_points(route_id, point_id, point_index) VALUES (2,5,2);
-- INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,5,4);