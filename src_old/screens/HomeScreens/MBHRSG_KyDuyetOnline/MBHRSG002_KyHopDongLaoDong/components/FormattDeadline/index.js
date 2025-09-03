export const formatContractEndDate = (dataString) => {
  const parts = dataString.split('Còn');

  if (parts.length === 2) {
    const endDate = parts[0].trim();
    const remainingDays = `Còn${parts[1].trim()}`;

    return `${endDate} (${remainingDays})`;
  }

  return dataString;
};