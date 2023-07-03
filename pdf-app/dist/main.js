"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.use((req, res, next) => {
        if (req.is('text/html')) {
            let data = '';
            req.setEncoding('utf8');
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                req.body = data;
                next();
            });
        }
        else {
            next();
        }
    });
    await app.listen(process.env.PORT || 8000);
}
bootstrap();
//# sourceMappingURL=main.js.map