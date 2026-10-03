// matches 'yyyy-MM-dd' or 'yyyy-MM-ddTHH:mm:ss' (with optional ms / timezone)
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/

export const formatDateDynamic = (date: Date, format: string): string => {
    const day = String(date.getDate()).padStart(2, '0');      
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yearFull = String(date.getFullYear());              
    const yearShort = yearFull.slice(-2);                    

    return format
      .replace(/dd/gi, day)
      .replace(/mm/gi, month)
      .replace(/yyyy/gi, yearFull)
      .replace(/yy/gi, yearShort);
}

