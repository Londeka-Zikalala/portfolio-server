import assert from 'assert';
import db from '../db.js';
import contactMe from '../SERVICE/contact-me.js';

const contactMeTest = contactMe(db)

describe('the contactMe function', function () {
    this.timeout(6000)
    beforeEach(async function () {
        await db.none(`DELETE FROM messages WHERE name = 'test-name'`);
    })
    it('should insert a new message request', async function () {
        const name = 'test-name';
        const message = 'Hi Londeka, Please get back to me to go over a web design I think aligns with your stack'
        const email = 'testname.test@gmail.com'
        const postedMessage = await contactMeTest.sendMessage(name,email,message)
        assert.equal(postedMessage, 'Message sent successfully!')

    })
    after(function () {
        db.$pool.end();}
    )
})