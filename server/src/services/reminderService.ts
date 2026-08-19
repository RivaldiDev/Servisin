import prisma from '../prisma';

export const updateRemindersStatusForVehicle = async (vehicleId: string, currentOdometer: number) => {
  const now = new Date();
  const reminders = await prisma.serviceReminder.findMany({
    where: { vehicleId, status: { not: 'COMPLETED' } },
  });

  const updatedReminders = [];

  for (const reminder of reminders) {
    let newStatus: 'ACTIVE' | 'DUE_SOON' | 'OVERDUE' = 'ACTIVE';

    const isOdometerOverdue = reminder.nextDueOdometer !== null && currentOdometer >= reminder.nextDueOdometer;
    const isDateOverdue = reminder.nextDueDate !== null && now >= reminder.nextDueDate;

    const isOdometerDueSoon =
      reminder.nextDueOdometer !== null &&
      reminder.nextDueOdometer - currentOdometer <= 500 &&
      currentOdometer < reminder.nextDueOdometer;

    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
    const isDateDueSoon =
      reminder.nextDueDate !== null &&
      reminder.nextDueDate.getTime() - now.getTime() <= fourteenDaysInMs &&
      now < reminder.nextDueDate;

    if (isOdometerOverdue || isDateOverdue) {
      newStatus = 'OVERDUE';
    } else if (isOdometerDueSoon || isDateDueSoon) {
      newStatus = 'DUE_SOON';
    } else {
      newStatus = 'ACTIVE';
    }

    if (newStatus !== reminder.status) {
      const updated = await prisma.serviceReminder.update({
        where: { id: reminder.id },
        data: { status: newStatus },
      });
      updatedReminders.push(updated);
    } else {
      updatedReminders.push(reminder);
    }
  }

  return updatedReminders;
};
