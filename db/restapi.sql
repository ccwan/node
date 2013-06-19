CREATE TABLE tbl_user (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    phoneNumber VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    passwd VARCHAR(128) NOT NULL,
    api_key VARCHAR(128) NOT NULL,
    veri_code VARCHAR(128) NOT NULL,
    status ENUM('new', 'verified', 'login', 'logout') NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_session (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    sessionId VARCHAR(256) NOT NULL,
    user_id INTEGER NOT NULL,
    lastVisit TIMESTAMP 
);

CREATE TABLE tbl_vendor (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    api_key VARCHAR(128) NOT NULL
);

CREATE TABLE tbl_deviceType (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    trigger_handler VARCHAR(1024) NOT NULL,
    action_handler VARCHAR(1024) NOT NULL
);

insert into tbl_deviceType set 
name = "Light", 
trigger_handler = "booleanIsOn", 
action_handler = "setOn";

insert into tbl_deviceType set 
name = "Temperature", 
trigger_handler = "valueLargerThan", 
action_handler = "";


CREATE TABLE tbl_model (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    trigger_handler VARCHAR(1024) NOT NULL,
    action_handler VARCHAR(1024) NOT NULL,
    vendor_id INTEGER NOT NULL,   
    deviceType_id INTEGER NOT NULL,   
    FOREIGN KEY (vendor_id) REFERENCES tbl_vendor(id),
    FOREIGN KEY (deviceType_id) REFERENCES tbl_deviceType(id)
);

CREATE TABLE tbl_device (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(128) NOT NULL,
    title VARCHAR(128) NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    user_id INTEGER NOT NULL,
    nwkIf_id tinyint(3) NOT NULL,
    model_id tinyint(3) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tbl_user(id),
    FOREIGN KEY (nwkIf_id) REFERENCES tbl_nwkIf(id),
    FOREIGN KEY (model_id) REFERENCES tbl_model(id)
);

CREATE TABLE tbl_datapointStore (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    data_key VARCHAR(1024) NOT NULL,
    data_value VARCHAR(1024) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_id INTEGER NOT NULL,   
    FOREIGN KEY (device_id) REFERENCES tbl_device(id)
);

CREATE TABLE tbl_datapointCache (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    data_key VARCHAR(1024) NOT NULL,
    data_value VARCHAR(1024) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    device_id INTEGER NOT NULL,   
    FOREIGN KEY (device_id) REFERENCES tbl_device(id)
);

CREATE TABLE tbl_nwkIf (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    uuid VARCHAR(128) NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tbl_user(id)
);

CREATE TABLE tbl_scheduler (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    startYear INTEGER NOT NULL,
    startMonth INTEGER NOT NULL,
    startDay INTEGER NOT NULL,
    startHour INTEGER NOT NULL,
    startMinute INTEGER NOT NULL,
    durationYear INTEGER NOT NULL,
    durationMonth INTEGER NOT NULL,
    durationDay INTEGER NOT NULL,
    durationWeek INTEGER NOT NULL,
    durationHour INTEGER NOT NULL,
    durationMinute INTEGER NOT NULL,
    durationSecond INTEGER NOT NULL,
    intervalUnit ENUM('once', 'year', 'month', 'day', 'week', 'hour', 'minute', 'second') NOT NULL,
    intervalNumber INTEGER NOT NULL,
    intervalWeekday INTEGER NOT NULL,
    intervalWeekdayNumber INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tbl_user(id)    
);

CREATE TABLE tbl_trigger (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    device_id INTEGER NOT NULL,
    handler VARCHAR(128) NOT NULL,
    params VARCHAR(128) NOT NULL
);

CREATE TABLE tbl_action (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    device_id INTEGER NOT NULL,
    handler VARCHAR(128) NOT NULL,
    params VARCHAR(128) NOT NULL
);

CREATE TABLE tbl_rule (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    trigger_id INTEGER NOT NULL,
    action_id INTEGER NOT NULL
);

CREATE TABLE tbl_timer (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    scheduler_id INTEGER NOT NULL,
    time TIMESTAMP NOT NULL,
    isPrimary TINYINT NOT NULL,
    prev INTEGER NOT NULL,
    next INTEGER NOT NULL
);











