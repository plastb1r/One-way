INSERT INTO users(user_id, user_name, user_password) VALUES (1,'Tom',1);
INSERT INTO users(user_id, user_name, user_password) VALUES (2,'Bob',2);

INSERT INTO routes(route_id, route_name) VALUES (1,'route1');
INSERT INTO routes(route_id, route_name) VALUES (2,'route2');

INSERT INTO points(point_id, google_id) VALUES (1,'wewrgdfsi');
INSERT INTO points(point_id, google_id) VALUES (2,'kihjyftgf');
INSERT INTO points(point_id, google_id) VALUES (3,'uighfdljs');
INSERT INTO points(point_id, google_id) VALUES (4,'uhjgdfghr');
INSERT INTO points(point_id, google_id) VALUES (5,'okmfdxhjf');

INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,1,1);
INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,2,2);
INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,3,3);
INSERT INTO route_points(route_id, point_id, point_index) VALUES (2,4,1);
INSERT INTO route_points(route_id, point_id, point_index) VALUES (2,5,2);
INSERT INTO route_points(route_id, point_id, point_index) VALUES (1,5,4);