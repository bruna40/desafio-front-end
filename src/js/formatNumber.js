export function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
    const matchWithAreaCode = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    const matchWithoutAreaCode = cleaned.match(/^(\d{5})(\d{4})$/);


    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    } else if (matchWithAreaCode) {
        return `(${matchWithAreaCode[1]}) ${matchWithAreaCode[2]}-${matchWithAreaCode[3]}`;
    } else if (matchWithoutAreaCode) {
        return `${matchWithoutAreaCode[1]}-${matchWithoutAreaCode[2]}`;
    } else {
        
        return phoneNumber;
    }
}