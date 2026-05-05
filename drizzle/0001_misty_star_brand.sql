CREATE TABLE `child_vaccines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`vaccineId` int NOT NULL,
	`status` enum('pending','scheduled','done','delayed') DEFAULT 'pending',
	`scheduledDate` date,
	`doneDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `child_vaccines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `children` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`birthDate` date NOT NULL,
	`gender` enum('boy','girl') NOT NULL,
	`feedingType` enum('breast','formula','mixed','solids'),
	`allergies` json DEFAULT '[]',
	`bloodType` varchar(10),
	`emergencyContact` json,
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `children_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctor_visits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`doctorName` varchar(255) NOT NULL,
	`specialty` varchar(100),
	`visitDate` date NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doctor_visits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `food_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`foodName` varchar(255) NOT NULL,
	`ingredients` json DEFAULT '[]',
	`amount` decimal(10,2),
	`unit` varchar(50),
	`eatenAt` timestamp NOT NULL,
	`notes` text,
	`photoUrl` text,
	`aiAnalysis` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `food_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `growth_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`recordDate` date NOT NULL,
	`weightKg` decimal(5,2),
	`heightCm` decimal(5,2),
	`headCircCm` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `growth_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `medical_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`documentType` enum('prescription','lab_result','health_card','vaccination_card','other') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`uploadedAt` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `medical_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`childId` int NOT NULL,
	`type` enum('vaccine_reminder','medication_reminder','appointment_reminder','symptom_alert','allergen_alert','other') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`isRead` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`doctorVisitId` int,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `prescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `symptom_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`foodEntryId` int,
	`symptomType` varchar(100) NOT NULL,
	`severity` int NOT NULL,
	`occurredAt` timestamp NOT NULL,
	`notes` text,
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `symptom_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`dueMonth` int NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vaccines_id` PRIMARY KEY(`id`)
);
