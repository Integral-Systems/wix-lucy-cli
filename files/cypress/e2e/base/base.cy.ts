
describe('Basic E2E Test', () => {
	const currentDate = new Date();
	const formattedDate = currentDate.toISOString().split('T')[0];
	const formattedTime = currentDate.toTimeString().split(' ')[0].replace(/:/g, '-');
	
	it('passes', () => {
		cy.visit('/');
		cy.get('#comp-m3blk8zj_r_comp-m3ta27x7').should('be.visible');
		cy.screenshot(`loaded_${formattedDate}_${formattedTime}`);
	});
});


