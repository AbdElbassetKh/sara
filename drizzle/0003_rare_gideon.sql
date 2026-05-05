CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`userId` int NOT NULL,
	`doctorName` varchar(255) NOT NULL,
	`specialty` varchar(100),
	`appointmentDate` timestamp NOT NULL,
	`location` varchar(255),
	`notes` text,
	`status` enum('upcoming','completed','cancelled') NOT NULL DEFAULT 'upcoming',
	`reminderSent` int DEFAULT 0,
	`reminderAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
