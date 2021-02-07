drop table if exists tasks;
drop table if exists workers;


create table workers (
  	id int AUTO_INCREMENT,
  	nama varchar(255) not null,  	
    email varchar(25),
    telepon varchar(12),
    alamat text,
    biografi text,    
    foto text,
  	primary key(id)
);

create table tasks (
  id int AUTO_INCREMENT,
  job text,
  done boolean default false,
  cancel boolean default false,
  added_at timestamp not null default now(),
  primary key(id),
  assignee_id int,
  FOREIGN KEY (assignee_id) 
    REFERENCES workers(id)    
    on delete cascade      
);

insert into workers (nama, email, telepon, alamat, biografi)
values 
  ('ilham', 'ilham@mail.com', '097848', 'bangkalan','ini biografi'),
  ('susi', 'susi@yahoo.com','0980','surabaya','biografi susi');

insert into tasks (assignee_id, job)
values 
  (1, 'makan'),  
  (2, 'minum'), 
  (1, 'belajar');
  
