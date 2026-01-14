// Script to initialize WhatsApp service
const whatsappService = require('../services/whatsappService');

async function init() {
  try {
    console.log('🚀 Initializing WhatsApp service...');
    await whatsappService.initialize();
    console.log('✅ WhatsApp service initialized successfully!');
    console.log('📱 You can now receive and send messages via WhatsApp');
  } catch (error) {
    console.error('❌ Failed to initialize WhatsApp:', error);
    process.exit(1);
  }
}

init();
