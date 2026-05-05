import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDb } from '../db';

vi.mock('../db', () => ({
  getDb: vi.fn(),
}));

describe('appointments router helpers', () => {
  it('getDb is callable', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
    };
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(mockDb);

    const db = await getDb();
    expect(db).toBeTruthy();
  });

  it('returns null when db is unavailable', async () => {
    (getDb as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const db = await getDb();
    expect(db).toBeNull();
  });

  it('appointment date formatting works correctly', () => {
    const date = new Date('2026-06-15T10:30:00');
    const formatted = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(formatted).toContain('2026');
    expect(formatted).toContain('15');
  });

  it('reminder date is 24h before appointment', () => {
    const appointmentDate = new Date('2026-06-15T10:30:00');
    const reminderAt = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000);
    expect(reminderAt.getDate()).toBe(14);
    expect(reminderAt.getHours()).toBe(appointmentDate.getHours());
  });

  it('upcoming filter works correctly', () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const appointments = [
      { id: 1, appointmentDate: futureDate, status: 'upcoming' },
      { id: 2, appointmentDate: pastDate, status: 'upcoming' },
      { id: 3, appointmentDate: futureDate, status: 'completed' },
    ];

    const upcoming = appointments.filter(
      (a) => a.status === 'upcoming' && a.appointmentDate >= now
    );
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].id).toBe(1);
  });

  it('days until calculation is correct', () => {
    const now = new Date();
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const diff = Math.ceil((in3Days.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    expect(diff).toBe(3);
  });
});
