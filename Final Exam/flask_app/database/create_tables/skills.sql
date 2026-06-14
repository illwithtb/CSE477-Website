CREATE TABLE IF NOT EXISTS `skills` (
`skills_id`        	 int(11)       NOT NULL AUTO_INCREMENT	COMMENT 'The skill id',
`experience_id`      int(11)       NOT NULL 				COMMENT 'FK:The experience id',
`name`               varchar(100)  NOT NULL					COMMENT 'Name of the skill',
`skill_level`	     int(2)  NOT NULL                 COMMENT 'My level of this skill from 1-10, 1 being worst, 10 being best',
PRIMARY KEY (`skills_id`),
FOREIGN KEY (experience_id) REFERENCES experiences(experience_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Skills I have";