CREATE TABLE `daily_checkins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`userId` int NOT NULL,
	`checkinDate` date NOT NULL,
	`hasSymptoms` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_checkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedbacks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`appVersion` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(10) DEFAULT 'DZD',
	`plan` enum('monthly','yearly') NOT NULL,
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionRef` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('free','monthly','yearly') NOT NULL DEFAULT 'free',
	`status` enum('active','expired','cancelled','pending') NOT NULL DEFAULT 'active',
	`premiumUntil` timestamp,
	`aiAnalysesUsedToday` int DEFAULT 0,
	`aiAnalysesResetAt` timestamp DEFAULT (now()),
	`paymentRef` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
