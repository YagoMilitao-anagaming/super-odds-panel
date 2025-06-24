export function getLast7DaysRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date();
  startDate.setDate(today.getDate() - 6); 

  const formatOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };

  const startDay = startDate.toLocaleDateString('pt-BR', { day: '2-digit' });
  const startMonth = startDate.toLocaleDateString('pt-BR', { month: 'short' });
  const endDay = endDate.toLocaleDateString('pt-BR', { day: '2-digit' });
  const endMonth = endDate.toLocaleDateString('pt-BR', { month: 'short' });
  const year = endDate.getFullYear();

  return {
    startDate: `${startDay} ${startMonth.charAt(0).toUpperCase() + startMonth.slice(1)}`,
    endDate: `${endDay} ${endMonth.charAt(0).toUpperCase() + endMonth.slice(1)} ${year}`
  };
}