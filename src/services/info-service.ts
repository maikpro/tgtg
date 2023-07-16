export class InfoService {
    static info() {
        console.log(
            '========================================================================',
        );

        console.log('started TooGoodToGo Watcher...');

        console.log(
            '========================================================================',
        );

        console.log(`BASE_URL: '${process.env.BASE_URL}'`);
        console.log(`AUTH_EMAIL: '${process.env.AUTH_EMAIL}'`);
        console.log(
            `REQUEST_POLLING_ID_URL: '${process.env.REQUEST_POLLING_ID_URL}'`,
        );
        console.log(`ITEMS_URL: '${process.env.ITEMS_URL}'`);

        console.log(
            '========================================================================',
        );
        console.log(
            '========================================================================',
        );

        console.log(`YOUR_EMAIL: '${process.env.YOUR_EMAIL}'`);

        console.log(
            '========================================================================',
        );
        console.log('\n');
    }
}
