import * as fs from 'fs';


export interface RenderToFsOPtions {
    renderer: (arg0: any, arg1: any) => Promise<string>;
    dataSource: string;
    destination: string;
}
/**
 * Render E-Mail to file system
 * @param {RenderToFsOPtions} options Preview Options
 * @returns {Promise<void>}
 */
export async function renderToFs(options: RenderToFsOPtions): Promise<void> {
	if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') return;
	console.log('rendered', process.env.NODE_ENV, options);
	fs.readFile(`typescript/backend/templates/data/${options.dataSource}`, 'utf8', async (err, data) => {
		if (err){
			console.error('Template Rendere => ', err);
			
			return;
		}
		const fakeDate = JSON.parse(data) as any; 
		console.log('fakeDate', fakeDate);
		const html = await options.renderer(fakeDate, 'de');
		fs.writeFile(`typescript/backend/templates/preview/${options.destination}.html`, html, err => {
			if (err){
				console.error(err);
			}
		});
	});
}