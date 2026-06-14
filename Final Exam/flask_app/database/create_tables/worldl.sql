CREATE TABLE IF NOT EXISTS `worldl` (
`worldl_id`          int(11)       NOT NULL AUTO_INCREMENT	COMMENT 'The worldl id',
`user`               varchar(100)   NOT NULL 		        COMMENT 'User who played wordle',
`score`              varchar(100)  DEFAULT NULL				COMMENT 'How long it took them to beat wordle',
PRIMARY KEY (`worldl_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Worldl Data";