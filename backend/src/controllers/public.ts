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

  static async getCampaigners(req: Request, res: Response, next: NextFunction) {
    try {
      const campaigners = [
        { hn: 1, name: "Asif ali", class: "Final year" },
        { hn: 2, name: "Bishrul wafa", class: "Final year" },
        { hn: 3, name: "Muhammed Falil", class: "Final year" },
        { hn: 4, name: "Sinan Cheekod", class: "Final year" },
        { hn: 5, name: "Sinan rafi", class: "Final year" },
        { hn: 6, name: "Ubayy Valliyad", class: "Final year" },
        { hn: 7, name: "Adhil Ameen", class: "Degree Third year" },
        { hn: 8, name: "Hashir puthoor", class: "Degree Third year" },
        { hn: 9, name: "Muhammed shaheer", class: "Degree Third year" },
        { hn: 10, name: "Muhammed Riswan", class: "Degree Third year" },
        { hn: 11, name: "Muhammed Ali", class: "Degree second year" },
        { hn: 12, name: "Muhammed Fayis", class: "Degree second year" },
        { hn: 13, name: "Sinan k", class: "Degree second year" },
        { hn: 14, name: "Yaseen kondotty", class: "Degree second year" },
        { hn: 15, name: "Muhammed Melattoor", class: "Degree first year" },
        { hn: 16, name: "Nihal valliyad", class: "Degree first year" },
        { hn: 17, name: "Anas Rahman", class: "Plus two" },
        { hn: 18, name: "Anas koduvally", class: "Plus two" },
        { hn: 19, name: "Anwar", class: "Plus two" },
        { hn: 20, name: "Adhil Nizar", class: "Plus two" },
        { hn: 21, name: "Naseel", class: "Plus two" },
        { hn: 22, name: "Sabith", class: "Plus two" },
        { hn: 23, name: "Sanah", class: "Plus two" },
        { hn: 24, name: "Savad", class: "Plus two" },
        { hn: 25, name: "Hashir kannur", class: "Plus two" },
        { hn: 26, name: "Yaseen c.k", class: "Plus two" },
        { hn: 27, name: "Abdu Rahman", class: "Plus one" },
        { hn: 28, name: "Adnan", class: "Plus one" },
        { hn: 29, name: "Anas Mooniyur", class: "Plus one" },
        { hn: 30, name: "Anees", class: "Plus one" },
        { hn: 31, name: "Basith moosa", class: "Plus one" },
        { hn: 32, name: "Farseen", class: "Plus one" },
        { hn: 33, name: "Hafil", class: "Plus one" },
        { hn: 34, name: "Mufeed", class: "Plus one" },
        { hn: 35, name: "Muzammil", class: "Plus one" },
        { hn: 36, name: "Rashal", class: "Plus one" },
        { hn: 37, name: "Rayyan", class: "Plus one" },
        { hn: 38, name: "Swalih", class: "Plus one" },
        { hn: 39, name: "Aboobacker Sidheeque", class: "Plus one" },
        { hn: 40, name: "Aneeb", class: "Plus one" }
      ];
      return res.status(200).json(campaigners);
    } catch (error) {
      next(error);
    }
  }

  static async getBanners(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: 'THEME',
          key: { startsWith: 'BANNER_' }
        },
        orderBy: { key: 'asc' }
      });
      
      const banners = settings.map(s => s.value);
      return res.status(200).json(banners);
    } catch (error) {
      next(error);
    }
  }
}
