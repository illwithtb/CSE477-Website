CREATE TABLE IF NOT EXISTS `feedback` (
`comment_id`        int(11)       NOT NULL AUTO_INCREMENT	COMMENT 'The comment id',
`name`              varchar(100)  NOT NULL 				    COMMENT 'Name of the commentator',
`email`             varchar(100)  NOT NULL					COMMENT 'Commentators email',
`comment`           varchar(500)  NOT NULL                  COMMENT 'Text of the comment',
PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Positions I have held";