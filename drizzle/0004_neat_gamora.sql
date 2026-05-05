CREATE TABLE `food_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(100) NOT NULL,
	`nameFr` varchar(100) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`icon` varchar(10) NOT NULL,
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `food_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `food_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`nameAr` varchar(100) NOT NULL,
	`nameFr` varchar(100) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`icon` varchar(10) NOT NULL,
	`isCommonAllergen` int DEFAULT 0,
	CONSTRAINT `food_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `symptom_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(100) NOT NULL,
	`nameFr` varchar(100) NOT NULL,
	`nameEn` varchar(100) NOT NULL,
	`icon` varchar(10) NOT NULL,
	`category` enum('skin','digestive','respiratory','neurological','other') DEFAULT 'other',
	CONSTRAINT `symptom_types_id` PRIMARY KEY(`id`)
);
