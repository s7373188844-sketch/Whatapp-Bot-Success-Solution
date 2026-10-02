require('dotenv').config();

module.exports = {
  BUSINESS_NAME: process.env.BUSINESS_NAME || 'SUCCESS COMPUTECH & GIFT SHOP',
  BUSINESS_PHONE: process.env.BUSINESS_PHONE || '7373188844',
  BUSINESS_ADDRESS: process.env.BUSINESS_ADDRESS || '15/12 Opp AK Motors, Pn Road, Tirupur 641602',
  OWNER_PHONE: process.env.OWNER_PHONE || '917373188844',

  workingHours: {
    weekday: {
      open: process.env.WEEKDAY_OPEN || '09:30',
      close: process.env.WEEKDAY_CLOSE || '21:00',
    },
    sunday: {
      open: process.env.SUNDAY_OPEN || '09:00',
      close: process.env.SUNDAY_CLOSE || '14:00',
    },
  },

  PRICE_TRIGGER_WORDS: [
    'price', 'cost', 'rate', 'fee', 'charge', 'amount', 'how much',
    'kitna', 'evvalavu', 'என்ன விலை', 'கட்டணம்', 'எவ்வளவு',
    'செலவு', 'தொகை', 'விலை', 'paisa', 'rupees', 'rs',
    'what is the charge', 'what is the fee', 'what is the cost',
    'total cost', 'service charge', 'fees',
  ],

  GREETING_WORDS: [
    'hi', 'hello', 'hey', 'vanakkam', 'வணக்கம்', 'hlo', 'hii',
    'good morning', 'good afternoon', 'good evening',
    'start', 'menu', 'help', 'services',
  ],
};
