import { Request, Response, NextFunction } from 'express';
import { prisma } from '../libraries/prisma';

export class PublicController {
  static async getHomeStats(req: Request, res: Response, next: NextFunction) {
    try {
      const donations = await prisma.donation.findMany({
        where: {
          status: { in: ['PENDING', 'VERIFIED'] }
        },
        select: {
          amount: true,
          notes: true,
          createdAt: true
        }
      });

      const campaignerStatsMap: { [name: string]: { name: string; unit: string; total: number; donors: number; lastActive: Date } } = {};
      const classStatsMap: { [className: string]: { className: string; total: number; donors: number } } = {};

      const campaignerTodayMap: { [name: string]: { name: string; unit: string; total: number; donors: number } } = {};
      const classTodayMap: { [className: string]: { className: string; total: number; donors: number } } = {};

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      for (const donation of donations) {
        const notes = donation.notes || '';
        
        // Extract Campaigner Name: e.g. "Logged by: Asif ali"
        const nameMatch = notes.match(/Logged by:\s*([^.]+)/i);
        const name = nameMatch ? nameMatch[1].trim() : '';

        // Extract Class Name: e.g. "Class: Final year"
        const classMatch = notes.match(/Class:\s*([^.]+)/i);
        const className = classMatch ? classMatch[1].trim() : '';

        if (!name || !className) continue;

        const amount = Number(donation.amount);
        const isToday = new Date(donation.createdAt) >= todayStart;

        // 1. Overall Campaigner Stats
        if (!campaignerStatsMap[name]) {
          campaignerStatsMap[name] = { name, unit: className, total: 0, donors: 0, lastActive: donation.createdAt };
        }
        campaignerStatsMap[name].total += amount;
        campaignerStatsMap[name].donors += 1;
        if (new Date(donation.createdAt) > new Date(campaignerStatsMap[name].lastActive)) {
          campaignerStatsMap[name].lastActive = donation.createdAt;
        }

        // 2. Today Campaigner Stats
        if (isToday) {
          if (!campaignerTodayMap[name]) {
            campaignerTodayMap[name] = { name, unit: className, total: 0, donors: 0 };
          }
          campaignerTodayMap[name].total += amount;
          campaignerTodayMap[name].donors += 1;
        }

        // 3. Overall Class Stats
        if (!classStatsMap[className]) {
          classStatsMap[className] = { className, total: 0, donors: 0 };
        }
        classStatsMap[className].total += amount;
        classStatsMap[className].donors += 1;

        // 4. Today Class Stats
        if (isToday) {
          if (!classTodayMap[className]) {
            classTodayMap[className] = { className, total: 0, donors: 0 };
          }
          classTodayMap[className].total += amount;
          classTodayMap[className].donors += 1;
        }
      }

      // Convert maps to sorted arrays
      const topVolunteers = Object.values(campaignerStatsMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map(({ name, unit, total, donors }) => ({ name, unit, total, donors }));

      const todayVolunteers = Object.values(campaignerTodayMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      const topClasses = Object.values(classStatsMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      const todayClasses = Object.values(classTodayMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      return res.status(200).json({
        success: true,
        data: {
          topVolunteers,
          todayVolunteers,
          topClasses,
          todayClasses
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
