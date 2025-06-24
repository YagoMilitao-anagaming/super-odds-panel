export const truncateStringWithHover = (str: string, maxLength: number = 4) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + '...';
};