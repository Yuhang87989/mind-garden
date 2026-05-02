const puppeteer = require('puppeteer');
const path = require('path');

async function runTests() {
    console.log('Starting Puppeteer tests...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 1. Test: Load page
    console.log('\n[TEST 1] Loading page...');
    await page.goto('file://' + path.join(__dirname, 'index.html'));
    await page.waitForTimeout(1000);
    
    const title = await page.title();
    console.log('Page title:', title);
    
    // 2. Test: Login page is displayed
    console.log('\n[TEST 2] Checking login page...');
    const loginLogo = await page.$('.login-logo');
    console.log('Login logo found:', !!loginLogo);
    
    const roleCards = await page.$$('.role-card');
    console.log('Role cards count:', roleCards.length);
    
    // 3. Test: Teen login flow
    console.log('\n[TEST 3] Testing teen login flow...');
    await roleCards[0].click();
    await page.waitForTimeout(500);
    
    const teenNameInput = await page.$('#teen-name-input');
    console.log('Teen name input found:', !!teenNameInput);
    
    await teenNameInput.type('邱宇菲');
    await page.click('.btn-primary');
    await page.waitForTimeout(500);
    
    const familyCodeDisplay = await page.$('#display-family-code');
    const familyCode = await familyCodeDisplay.textContent();
    console.log('Family code generated:', familyCode);
    
    // 4. Test: Enter teen mode
    console.log('\n[TEST 4] Entering teen mode...');
    await page.click('.btn-primary');
    await page.waitForTimeout(1000);
    
    const welcomeText = await page.$('#welcome-text');
    const welcomeContent = await welcomeText.textContent();
    console.log('Welcome text:', welcomeContent);
    
    const moodCard = await page.$('.mood-card');
    console.log('Mood card found:', !!moodCard);
    
    // 5. Test: Mood selection
    console.log('\n[TEST 5] Testing mood selection...');
    const moodBtns = await page.$$('.mood-btn');
    console.log('Mood buttons count:', moodBtns.length);
    
    await moodBtns[3].click(); // Select happy
    await page.waitForTimeout(300);
    
    const selectedMood = await page.$('.mood-btn.selected');
    console.log('Mood selected:', !!selectedMood);
    
    // 6. Test: Save mood
    console.log('\n[TEST 6] Testing mood save...');
    await page.fill('#mood-note', '今天心情不错！');
    await page.click('.save-btn');
    await page.waitForTimeout(500);
    
    // 7. Test: SOS button
    console.log('\n[TEST 7] Testing SOS button...');
    const sosButton = await page.$('#sos-button');
    console.log('SOS button found:', !!sosButton);
    
    await sosButton.click();
    await page.waitForTimeout(500);
    
    const sosModal = await page.$('#sos-modal.active');
    console.log('SOS modal opened:', !!sosModal);
    
    // 8. Test: Close SOS modal
    console.log('\n[TEST 8] Closing SOS modal...');
    await page.click('.modal-btn-cancel');
    await page.waitForTimeout(300);
    
    // 9. Test: Navigate to chat
    console.log('\n[TEST 9] Testing chat navigation...');
    await page.click('.module-card:first-child');
    await page.waitForTimeout(500);
    
    const chatMessages = await page.$('#chat-messages');
    console.log('Chat page loaded:', !!chatMessages);
    
    // 10. Test: Check console errors
    console.log('\n[TEST 10] Checking console errors...');
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.reload();
    await page.waitForTimeout(2000);
    console.log('Console errors:', errors.length === 0 ? 'None' : errors.join(', '));
    
    console.log('\n========== All tests completed! ==========');
    
    await browser.close();
}

runTests().catch(console.error);
