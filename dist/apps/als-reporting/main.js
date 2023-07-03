/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addIpMeta = exports.initWinston = exports.winstonLogger = void 0;
const winston = __webpack_require__(5);
class WinstonLogger {
    constructor(path) {
        this.infoLog = winston.createLogger({
            levels: {
                info: 1,
            },
            transports: [
                new winston.transports.File({
                    filename: `${path}/info/${new Date().toDateString()}`,
                    level: 'info',
                }),
            ],
        });
        this.warnLog = winston.createLogger({
            levels: {
                warn: 2,
            },
            transports: [
                new winston.transports.File({
                    filename: `${path}/warn/${new Date().toDateString()}`,
                    level: 'warn',
                }),
            ],
        });
        this.errorLog = winston.createLogger({
            levels: {
                error: 3,
            },
            transports: [
                new winston.transports.File({
                    filename: `${path}/error/${new Date().toDateString()}`,
                    level: 'error',
                }),
            ],
        });
    }
    static getInstance(path) {
        if (!WinstonLogger.instance) {
            WinstonLogger.instance = new WinstonLogger(path);
        }
        return WinstonLogger.instance;
    }
    addMeta(meta) {
        this.infoLog.defaultMeta = meta;
        this.warnLog.defaultMeta = meta;
        this.errorLog.defaultMeta = meta;
    }
}
const initWinston = (path) => {
    exports.winstonLogger = WinstonLogger.getInstance(path);
};
exports.initWinston = initWinston;
const addIpMeta = (req, _res, next) => {
    const ip = req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress;
    exports.winstonLogger.addMeta(ip ? { ip } : null);
    next();
};
exports.addIpMeta = addIpMeta;


/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("winston");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlsReportingModule = void 0;
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(9);
const core_1 = __webpack_require__(2);
const throttler_1 = __webpack_require__(10);
const auth_manager_1 = __webpack_require__(11);
const manager_1 = __webpack_require__(15);
const als_reporting_controller_1 = __webpack_require__(152);
const als_reporting_service_1 = __webpack_require__(153);
const report_module_1 = __webpack_require__(154);
let AlsReportingModule = class AlsReportingModule {
};
AlsReportingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ envFilePath: 'apps/als-reporting/.env' }),
            throttler_1.ThrottlerModule.forRoot({
                ttl: 60,
                limit: 100,
            }),
            report_module_1.ReportModule,
            manager_1.ManagerModule,
            auth_manager_1.AuthManagerModule,
        ],
        controllers: [als_reporting_controller_1.AlsReportingController],
        providers: [
            als_reporting_service_1.AlsReportingService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AlsReportingModule);
exports.AlsReportingModule = AlsReportingModule;


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(12), exports);
__exportStar(__webpack_require__(147), exports);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthManagerModule = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(13);
const passport_1 = __webpack_require__(14);
const manager_1 = __webpack_require__(15);
const auth_manager_service_1 = __webpack_require__(147);
const jwt_strategy_1 = __webpack_require__(148);
const local_strategy_1 = __webpack_require__(150);
let AuthManagerModule = class AuthManagerModule {
};
AuthManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            manager_1.ManagerModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRY },
            }),
        ],
        providers: [auth_manager_service_1.AuthManagerService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_manager_service_1.AuthManagerService],
    })
], AuthManagerModule);
exports.AuthManagerModule = AuthManagerModule;


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(16), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(43), exports);
__exportStar(__webpack_require__(47), exports);
__exportStar(__webpack_require__(50), exports);
__exportStar(__webpack_require__(56), exports);
__exportStar(__webpack_require__(63), exports);
__exportStar(__webpack_require__(67), exports);
__exportStar(__webpack_require__(71), exports);
__exportStar(__webpack_require__(75), exports);
__exportStar(__webpack_require__(78), exports);
__exportStar(__webpack_require__(85), exports);
__exportStar(__webpack_require__(88), exports);
__exportStar(__webpack_require__(94), exports);
__exportStar(__webpack_require__(99), exports);
__exportStar(__webpack_require__(101), exports);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssignProjectManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const AssignProject_1 = __webpack_require__(20);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const master_requirement_model_1 = __webpack_require__(33);
const template_model_1 = __webpack_require__(34);
const assign_project_model_1 = __webpack_require__(35);
let AssignProjectManagerService = class AssignProjectManagerService extends nestjs_1.AutomapperProfile {
    constructor(assignProjectModel, template, masterRequirementModel, mapper) {
        super(mapper);
        this.assignProjectModel = assignProjectModel;
        this.template = template;
        this.masterRequirementModel = masterRequirementModel;
        this.mapper = mapper;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, assign_project_model_1.AssignProjectModel, AssignProject_1.AssignProjectCompleteResponseDto);
            (0, core_1.createMap)(mapper, assign_project_model_1.AssignProjectModel, AssignProject_1.AssignProjectCompleteResponseDto, (0, core_1.forMember)(d => d.vendor, (0, core_1.mapFrom)(s => s.vendor)), (0, core_1.forMember)(d => d.compliance, (0, core_1.mapFrom)(s => s.compliance)), (0, core_1.forMember)(d => d.project, (0, core_1.mapFrom)(s => s.project)), (0, core_1.forMember)(d => d.contact, (0, core_1.mapFrom)(s => s.contact)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.assignProjectModel.create(createPayloadDto);
            return this.mapper.map(res, assign_project_model_1.AssignProjectModel, AssignProject_1.AssignProjectCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.assignProjectModel.findById(id);
            return this.mapper.map(res, assign_project_model_1.AssignProjectModel, AssignProject_1.AssignProjectCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async findOne(conditions) {
        try {
            const res = await this.assignProjectModel.findOne(conditions);
            return this.mapper.map(res, assign_project_model_1.AssignProjectModel, AssignProject_1.AssignProjectCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async vendorDashboard(uuid) {
        try {
            const compliantProject = await this.assignProjectModel.aggregate([
                {
                    $match: { uuid: uuid },
                },
                {
                    $lookup: {
                        from: 'vendormodels',
                        localField: 'vendor_id',
                        foreignField: '_id',
                        as: 'vendor',
                    },
                },
                {
                    $lookup: {
                        from: 'compliancemodels',
                        localField: 'compliance_id',
                        foreignField: '_id',
                        as: 'compliance',
                    },
                },
                {
                    $lookup: {
                        from: 'projectmodels',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'project',
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contact_id',
                        foreignField: '_id',
                        as: 'contact',
                    },
                },
                {
                    $unwind: {
                        path: '$vendor',
                    },
                },
                {
                    $unwind: {
                        path: '$project',
                    },
                },
                {
                    $unwind: {
                        path: '$compliance',
                    },
                },
                {
                    $unwind: {
                        path: '$contact',
                    },
                },
                {
                    $addFields: {
                        complianceStatus: '$compliance.status',
                    },
                },
                {
                    $match: {
                        complianceStatus: true,
                    },
                },
            ]);
            if (compliantProject.length < 1) {
                throw new apiError_1.ServiceError('Compliance not found', common_1.HttpStatus.BAD_REQUEST);
            }
            for (const template_item of compliantProject[0].compliance
                .template_items) {
                const template = await this.template.findById(template_item.template_id);
                if (template) {
                    template_item.template_name = template.template_name;
                    if (template.rules.length > 0) {
                        for (const rule of template === null || template === void 0 ? void 0 : template.rules) {
                            if (rule._id.toString() ===
                                template_item.template_rule_id.toString()) {
                                template_item.rule_detail = rule;
                                const masterRequirement = await this.masterRequirementModel.findById(rule.master_requirement_id);
                                template_item.master_requirement = masterRequirement;
                            }
                        }
                    }
                }
            }
            for (const compliance_item of compliantProject[0].compliance
                .compliance_items) {
                const masterRequirement = await this.masterRequirementModel.findById(new mongodb_1.ObjectId(compliance_item.master_requirement_id));
                compliance_item.master_requirement = masterRequirement;
            }
            return this.mapper.map(compliantProject[0], assign_project_model_1.AssignProjectModel, AssignProject_1.AssignProjectCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
AssignProjectManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(assign_project_model_1.AssignProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __param(3, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _d : Object])
], AssignProjectManagerService);
exports.AssignProjectManagerService = AssignProjectManagerService;


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@automapper/core");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("@automapper/nestjs");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssignProjectCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const Compliance_1 = __webpack_require__(22);
const mongodb_1 = __webpack_require__(25);
const Contact_1 = __webpack_require__(29);
const Project_1 = __webpack_require__(26);
const Vendor_1 = __webpack_require__(30);
class AssignProjectCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], AssignProjectCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], AssignProjectCompleteResponseDto.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], AssignProjectCompleteResponseDto.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], AssignProjectCompleteResponseDto.prototype, "requirement_group_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], AssignProjectCompleteResponseDto.prototype, "compliance_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], AssignProjectCompleteResponseDto.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_f = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _f : Object)
], AssignProjectCompleteResponseDto.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_g = typeof Vendor_1.VendorCompleteResponseDto !== "undefined" && Vendor_1.VendorCompleteResponseDto) === "function" ? _g : Object)
], AssignProjectCompleteResponseDto.prototype, "vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_h = typeof Compliance_1.ComplianceCompleteResponsDto !== "undefined" && Compliance_1.ComplianceCompleteResponsDto) === "function" ? _h : Object)
], AssignProjectCompleteResponseDto.prototype, "compliance", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_j = typeof Project_1.ProjectCompleteResponseDTO !== "undefined" && Project_1.ProjectCompleteResponseDTO) === "function" ? _j : Object)
], AssignProjectCompleteResponseDto.prototype, "project", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_k = typeof Contact_1.ContactCompleteResponseDto !== "undefined" && Contact_1.ContactCompleteResponseDto) === "function" ? _k : Object)
], AssignProjectCompleteResponseDto.prototype, "contact", void 0);
exports.AssignProjectCompleteResponseDto = AssignProjectCompleteResponseDto;


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("@automapper/classes");

/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplianceCompleteResponsDto = void 0;
const classes_1 = __webpack_require__(21);
const class_transformer_1 = __webpack_require__(23);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
const Project_1 = __webpack_require__(26);
class ComplianceCompleteResponsDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ComplianceCompleteResponsDto.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceCompleteResponsDto.prototype, "vendor_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], ComplianceCompleteResponsDto.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], ComplianceCompleteResponsDto.prototype, "escalation_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceCompleteResponsDto.prototype, "project_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_transformer_1.Type)(() => Project_1.ProjectCompleteResponseDTO),
    (0, class_validator_1.ValidateNested)(),
    (0, class_validator_1.IsNotEmptyObject)(),
    __metadata("design:type", typeof (_d = typeof Project_1.ProjectCompleteResponseDTO !== "undefined" && Project_1.ProjectCompleteResponseDTO) === "function" ? _d : Object)
], ComplianceCompleteResponsDto.prototype, "project", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], ComplianceCompleteResponsDto.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ComplianceCompleteResponsDto.prototype, "client_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_f = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _f : Object)
], ComplianceCompleteResponsDto.prototype, "requirement_group_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ComplianceCompleteResponsDto.prototype, "compliance_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ComplianceCompleteResponsDto.prototype, "template_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_g = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _g : Object)
], ComplianceCompleteResponsDto.prototype, "user_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_h = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _h : Object)
], ComplianceCompleteResponsDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ComplianceCompleteResponsDto.prototype, "in_escalation", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ComplianceCompleteResponsDto.prototype, "status", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_j = typeof Record !== "undefined" && Record) === "function" ? _j : Object)
], ComplianceCompleteResponsDto.prototype, "acord_28_ocr_data", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_k = typeof Record !== "undefined" && Record) === "function" ? _k : Object)
], ComplianceCompleteResponsDto.prototype, "acord_25_ocr_data", void 0);
exports.ComplianceCompleteResponsDto = ComplianceCompleteResponsDto;


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectCompleteResponseDTO = void 0;
const classes_1 = __webpack_require__(21);
const project_model_1 = __webpack_require__(27);
const mongodb_1 = __webpack_require__(25);
class ProjectCompleteResponseDTO {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ProjectCompleteResponseDTO.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.Client),
    __metadata("design:type", typeof (_b = typeof project_model_1.Client !== "undefined" && project_model_1.Client) === "function" ? _b : Object)
], ProjectCompleteResponseDTO.prototype, "client", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], ProjectCompleteResponseDTO.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "property_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "county", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "notes", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectCompleteResponseDTO.prototype, "waivers", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.Manager),
    __metadata("design:type", typeof (_c = typeof project_model_1.Manager !== "undefined" && project_model_1.Manager) === "function" ? _c : Object)
], ProjectCompleteResponseDTO.prototype, "manager", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.CertificateHolders),
    __metadata("design:type", Array)
], ProjectCompleteResponseDTO.prototype, "certificate_holders", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], ProjectCompleteResponseDTO.prototype, "contacts", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.Document),
    __metadata("design:type", Array)
], ProjectCompleteResponseDTO.prototype, "documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.AssignedVendor),
    __metadata("design:type", Array)
], ProjectCompleteResponseDTO.prototype, "assigned_vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.PartiesToTheTransaction),
    __metadata("design:type", typeof (_d = typeof project_model_1.PartiesToTheTransaction !== "undefined" && project_model_1.PartiesToTheTransaction) === "function" ? _d : Object)
], ProjectCompleteResponseDTO.prototype, "parties_to_the_transaction", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.ProjectSchedule),
    __metadata("design:type", typeof (_e = typeof project_model_1.ProjectSchedule !== "undefined" && project_model_1.ProjectSchedule) === "function" ? _e : Object)
], ProjectCompleteResponseDTO.prototype, "project_schedule", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.DealSummary),
    __metadata("design:type", typeof (_f = typeof project_model_1.DealSummary !== "undefined" && project_model_1.DealSummary) === "function" ? _f : Object)
], ProjectCompleteResponseDTO.prototype, "deal_summary", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.MaterialDocumentAndCertificate),
    __metadata("design:type", Array)
], ProjectCompleteResponseDTO.prototype, "material_documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.MaterialDocumentAndCertificate),
    __metadata("design:type", Array)
], ProjectCompleteResponseDTO.prototype, "certificates", void 0);
exports.ProjectCompleteResponseDTO = ProjectCompleteResponseDTO;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectModelSchema = exports.ProjectModel = exports.PartiesToTheTransactionSchema = exports.PartiesToTheTransaction = exports.ManagerSchema = exports.Manager = exports.ClientSchema = exports.Client = exports.MaterialDocumentAndCertificateSchema = exports.MaterialDocumentAndCertificate = exports.ProjectScheduleSchema = exports.ProjectSchedule = exports.DealSummarySchema = exports.DealSummary = exports.DocumentSchema = exports.Document = exports.SingleDocumentSchema = exports.SingleDocument = exports.AssignedVendorSchema = exports.AssignedVendor = exports.CertificateHoldersSchema = exports.CertificateHolders = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let CertificateHolders = class CertificateHolders {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], CertificateHolders.prototype, "zip", void 0);
CertificateHolders = __decorate([
    (0, mongoose_1.Schema)()
], CertificateHolders);
exports.CertificateHolders = CertificateHolders;
exports.CertificateHoldersSchema = mongoose_1.SchemaFactory.createForClass(CertificateHolders);
let AssignedVendor = class AssignedVendor {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], AssignedVendor.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], AssignedVendor.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AssignedVendor.prototype, "vendor_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], AssignedVendor.prototype, "requirement_group_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AssignedVendor.prototype, "requirement_group_name", void 0);
AssignedVendor = __decorate([
    (0, mongoose_1.Schema)()
], AssignedVendor);
exports.AssignedVendor = AssignedVendor;
exports.AssignedVendorSchema = mongoose_1.SchemaFactory.createForClass(AssignedVendor);
let SingleDocument = class SingleDocument {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SingleDocument.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], SingleDocument.prototype, "key", void 0);
SingleDocument = __decorate([
    (0, mongoose_1.Schema)()
], SingleDocument);
exports.SingleDocument = SingleDocument;
exports.SingleDocumentSchema = mongoose_1.SchemaFactory.createForClass(SingleDocument);
let Document = class Document {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Document.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [exports.SingleDocumentSchema], default: [] }),
    __metadata("design:type", Array)
], Document.prototype, "documents", void 0);
Document = __decorate([
    (0, mongoose_1.Schema)()
], Document);
exports.Document = Document;
exports.DocumentSchema = mongoose_1.SchemaFactory.createForClass(Document);
let DealSummary = class DealSummary {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "client_stage", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "engineer", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "analyst", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "total_units", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "total_square_foot", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "elevator_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "pool", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "tenancy", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "tenant_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "tenant_commercial", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "rehab_or_new_const", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "est_const_period", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "project_description", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "other_key_info", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "flood_zone", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "eq_zone", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "renovation", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "high_risk_area", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "sinkhole_exposure", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "exterior_finish", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "water_protection", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "playground_area", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "wind_tier", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "construction_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "protection", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "structural_system", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "roofing", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DealSummary.prototype, "fire_protection_safety", void 0);
DealSummary = __decorate([
    (0, mongoose_1.Schema)()
], DealSummary);
exports.DealSummary = DealSummary;
exports.DealSummarySchema = mongoose_1.SchemaFactory.createForClass(DealSummary);
let ProjectSchedule = class ProjectSchedule {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Date }),
    __metadata("design:type", typeof (_d = typeof mongoose_2.Date !== "undefined" && mongoose_2.Date) === "function" ? _d : Object)
], ProjectSchedule.prototype, "closing_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Date }),
    __metadata("design:type", typeof (_e = typeof mongoose_2.Date !== "undefined" && mongoose_2.Date) === "function" ? _e : Object)
], ProjectSchedule.prototype, "construction_start_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Date }),
    __metadata("design:type", typeof (_f = typeof mongoose_2.Date !== "undefined" && mongoose_2.Date) === "function" ? _f : Object)
], ProjectSchedule.prototype, "estimated_construction_completion_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Date }),
    __metadata("design:type", typeof (_g = typeof mongoose_2.Date !== "undefined" && mongoose_2.Date) === "function" ? _g : Object)
], ProjectSchedule.prototype, "tco_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "bldg_rcv", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "bldg_pers_prop", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "hard_costs", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "soft_costs", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "loss_rents", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "estimated_prem_ins_cost", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "in_constructions", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "Initial_comp_rpt_sent", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectSchedule.prototype, "replacement_cost", void 0);
ProjectSchedule = __decorate([
    (0, mongoose_1.Schema)()
], ProjectSchedule);
exports.ProjectSchedule = ProjectSchedule;
exports.ProjectScheduleSchema = mongoose_1.SchemaFactory.createForClass(ProjectSchedule);
let MaterialDocumentAndCertificate = class MaterialDocumentAndCertificate {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], MaterialDocumentAndCertificate.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.Date }),
    __metadata("design:type", typeof (_h = typeof mongoose_2.Date !== "undefined" && mongoose_2.Date) === "function" ? _h : Object)
], MaterialDocumentAndCertificate.prototype, "vers_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], MaterialDocumentAndCertificate.prototype, "comments", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, enum: ['R', 'Y', 'G'], default: 'R' }),
    __metadata("design:type", String)
], MaterialDocumentAndCertificate.prototype, "status", void 0);
MaterialDocumentAndCertificate = __decorate([
    (0, mongoose_1.Schema)()
], MaterialDocumentAndCertificate);
exports.MaterialDocumentAndCertificate = MaterialDocumentAndCertificate;
exports.MaterialDocumentAndCertificateSchema = mongoose_1.SchemaFactory.createForClass(MaterialDocumentAndCertificate);
let Client = class Client {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_j = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _j : Object)
], Client.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
Client = __decorate([
    (0, mongoose_1.Schema)()
], Client);
exports.Client = Client;
exports.ClientSchema = mongoose_1.SchemaFactory.createForClass(Client);
let Manager = class Manager {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_k = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _k : Object)
], Manager.prototype, "manager_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Manager.prototype, "name", void 0);
Manager = __decorate([
    (0, mongoose_1.Schema)()
], Manager);
exports.Manager = Manager;
exports.ManagerSchema = mongoose_1.SchemaFactory.createForClass(Manager);
let PartiesToTheTransaction = class PartiesToTheTransaction {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "named_insured_partnership", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "add_l_Ins", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "add_l_Ins_special_member", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "add_l_Ins_tax_credit_investment_fund", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "add_l_Ins_investment_member", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "investor_bank", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], PartiesToTheTransaction.prototype, "inv_member", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], PartiesToTheTransaction.prototype, "additional_insured", void 0);
PartiesToTheTransaction = __decorate([
    (0, mongoose_1.Schema)()
], PartiesToTheTransaction);
exports.PartiesToTheTransaction = PartiesToTheTransaction;
exports.PartiesToTheTransactionSchema = mongoose_1.SchemaFactory.createForClass(PartiesToTheTransaction);
let ProjectModel = class ProjectModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_l = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _l : Object)
], ProjectModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: exports.ClientSchema }),
    __metadata("design:type", Client)
], ProjectModel.prototype, "client", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    name: v,
                });
                return count === 0;
            },
            message: 'name must be unique',
        },
    }),
    __metadata("design:type", String)
], ProjectModel.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId], default: [] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "property_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "county", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "contacts", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [exports.CertificateHoldersSchema], default: [] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "certificate_holders", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: exports.ManagerSchema }),
    __metadata("design:type", Manager)
], ProjectModel.prototype, "manager", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [exports.DocumentSchema], default: [] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [exports.AssignedVendorSchema], default: [] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "assigned_vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: exports.PartiesToTheTransactionSchema }),
    __metadata("design:type", PartiesToTheTransaction)
], ProjectModel.prototype, "parties_to_the_transaction", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: exports.ProjectScheduleSchema }),
    __metadata("design:type", ProjectSchedule)
], ProjectModel.prototype, "project_schedule", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: exports.DealSummarySchema }),
    __metadata("design:type", DealSummary)
], ProjectModel.prototype, "deal_summary", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [exports.MaterialDocumentAndCertificateSchema], default: [] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "material_documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [exports.MaterialDocumentAndCertificateSchema], default: [] }),
    __metadata("design:type", Array)
], ProjectModel.prototype, "certificates", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "notes", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProjectModel.prototype, "waivers", void 0);
ProjectModel = __decorate([
    (0, mongoose_1.Schema)()
], ProjectModel);
exports.ProjectModel = ProjectModel;
exports.ProjectModelSchema = mongoose_1.SchemaFactory.createForClass(ProjectModel);


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class ContactCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ContactCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "title", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "address_3", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "fax", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "direct", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "mobile", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactCompleteResponseDto.prototype, "contact_type", void 0);
exports.ContactCompleteResponseDto = ContactCompleteResponseDto;


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VendorCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class VendorCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], VendorCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "username", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], VendorCompleteResponseDto.prototype, "contacts", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], VendorCompleteResponseDto.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "vendor_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "alias", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "scope_of_work", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorCompleteResponseDto.prototype, "title", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], VendorCompleteResponseDto.prototype, "direct_dial", void 0);
exports.VendorCompleteResponseDto = VendorCompleteResponseDto;


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceError = void 0;
const common_1 = __webpack_require__(1);
class ServiceError extends Error {
    constructor(message, statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ServiceError = ServiceError;


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorHandler = void 0;
const common_1 = __webpack_require__(1);
const mongodb_1 = __webpack_require__(25);
const apiError_1 = __webpack_require__(31);
const winstonLogger_1 = __webpack_require__(4);
function errorHandler(error) {
    if (error instanceof mongodb_1.MongoError) {
        winstonLogger_1.winstonLogger.errorLog.error(error.stack);
        throw new Error(`MongoDB error: ${error.message}`);
    }
    else if (error instanceof apiError_1.ServiceError) {
        winstonLogger_1.winstonLogger.errorLog.error(error.stack);
        throw error;
    }
    else if (error instanceof Object) {
        winstonLogger_1.winstonLogger.errorLog.error(error.message);
        throw new apiError_1.ServiceError(error.errors[Object.keys(error.errors)[0]].message ||
            'Something went wrong', common_1.HttpStatus.BAD_REQUEST);
    }
    else {
        throw new Error('Something went wrong');
    }
}
exports.errorHandler = errorHandler;


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MasterRequirementModelSchema = exports.MasterRequirementModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
let MasterRequirementModel = class MasterRequirementModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], MasterRequirementModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    uuid: v,
                });
                return count === 0;
            },
            message: 'uuid must be unique',
        },
    }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "coverage_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "coverage_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "document_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "requirement_description", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", Number)
], MasterRequirementModel.prototype, "order", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "requirement_rule", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "default_comment", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MasterRequirementModel.prototype, "OCR", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String], required: false }),
    __metadata("design:type", Array)
], MasterRequirementModel.prototype, "OCR_KEY", void 0);
MasterRequirementModel = __decorate([
    (0, mongoose_1.Schema)()
], MasterRequirementModel);
exports.MasterRequirementModel = MasterRequirementModel;
exports.MasterRequirementModelSchema = mongoose_1.SchemaFactory.createForClass(MasterRequirementModel);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateModelSchema = exports.TemplateModel = exports.RuleEntity = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let RuleEntity = class RuleEntity {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], RuleEntity.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], RuleEntity.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], RuleEntity.prototype, "master_requirement_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], RuleEntity.prototype, "condition", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], RuleEntity.prototype, "value", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], RuleEntity.prototype, "message", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, required: true, default: false }),
    __metadata("design:type", Boolean)
], RuleEntity.prototype, "is_enabled", void 0);
RuleEntity = __decorate([
    (0, mongoose_1.Schema)()
], RuleEntity);
exports.RuleEntity = RuleEntity;
const RuleSchema = mongoose_1.SchemaFactory.createForClass(RuleEntity);
let TemplateModel = class TemplateModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], TemplateModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
    }),
    __metadata("design:type", String)
], TemplateModel.prototype, "template_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [RuleSchema], required: true }),
    __metadata("design:type", Array)
], TemplateModel.prototype, "rules", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], TemplateModel.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, required: true, default: true }),
    __metadata("design:type", Boolean)
], TemplateModel.prototype, "active", void 0);
TemplateModel = __decorate([
    (0, mongoose_1.Schema)()
], TemplateModel);
exports.TemplateModel = TemplateModel;
exports.TemplateModelSchema = mongoose_1.SchemaFactory.createForClass(TemplateModel);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssignProjectModelSchema = exports.AssignProjectModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const Compliance_1 = __webpack_require__(22);
const Contact_1 = __webpack_require__(29);
const Project_1 = __webpack_require__(26);
const Vendor_1 = __webpack_require__(30);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let AssignProjectModel = class AssignProjectModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], AssignProjectModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    uuid: v,
                });
                return count === 0;
            },
            message: 'uuid must be unique',
        },
    }),
    __metadata("design:type", String)
], AssignProjectModel.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], AssignProjectModel.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], AssignProjectModel.prototype, "requirement_group_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], AssignProjectModel.prototype, "compliance_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], AssignProjectModel.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_f = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _f : Object)
], AssignProjectModel.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_g = typeof Vendor_1.VendorCompleteResponseDto !== "undefined" && Vendor_1.VendorCompleteResponseDto) === "function" ? _g : Object)
], AssignProjectModel.prototype, "vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_h = typeof Compliance_1.ComplianceCompleteResponsDto !== "undefined" && Compliance_1.ComplianceCompleteResponsDto) === "function" ? _h : Object)
], AssignProjectModel.prototype, "compliance", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_j = typeof Project_1.ProjectCompleteResponseDTO !== "undefined" && Project_1.ProjectCompleteResponseDTO) === "function" ? _j : Object)
], AssignProjectModel.prototype, "project", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_k = typeof Contact_1.ContactCompleteResponseDto !== "undefined" && Contact_1.ContactCompleteResponseDto) === "function" ? _k : Object)
], AssignProjectModel.prototype, "contact", void 0);
AssignProjectModel = __decorate([
    (0, mongoose_1.Schema)()
], AssignProjectModel);
exports.AssignProjectModel = AssignProjectModel;
exports.AssignProjectModelSchema = mongoose_1.SchemaFactory.createForClass(AssignProjectModel);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const services_1 = __webpack_require__(37);
const mongoose_1 = __webpack_require__(19);
const Client_1 = __webpack_require__(38);
const ClientPartial_1 = __webpack_require__(39);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const client_model_1 = __webpack_require__(42);
let ClientManagerService = class ClientManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, ClientModel) {
        super(mapper);
        this.mapper = mapper;
        this.ClientModel = ClientModel;
        this.logger = new services_1.Logger();
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, client_model_1.ClientModel, Client_1.ClientCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.contacts_id, (0, core_1.mapFrom)(s => s.contacts_id)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)), (0, core_1.forMember)(d => d.company_manager, (0, core_1.mapFrom)(s => s.company_manager)));
            (0, core_1.createMap)(mapper, client_model_1.ClientModel, ClientPartial_1.ClientPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.contacts_id, (0, core_1.mapFrom)(s => s.contacts_id)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)), (0, core_1.forMember)(d => d.company_manager, (0, core_1.mapFrom)(s => s.company_manager)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.ClientModel.create(createPayloadDto);
            return this.mapper.map(res, client_model_1.ClientModel, Client_1.ClientCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.ClientModel.aggregate([
                {
                    $match: { _id: new mongodb_1.ObjectId(id) },
                },
                {
                    $lookup: {
                        from: 'tagmodels',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags',
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contacts_id',
                        foreignField: '_id',
                        as: 'contacts_id',
                    },
                },
                {
                    $lookup: {
                        from: 'usermodels',
                        localField: 'company_manager',
                        foreignField: '_id',
                        as: 'company_manager',
                    },
                },
                {
                    $unwind: {
                        path: '$company_manager',
                    },
                },
            ]);
            return this.mapper.map(res[0], client_model_1.ClientModel, Client_1.ClientCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.ClientModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, client_model_1.ClientModel, Client_1.ClientCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async assignContacts(id, contactUpdatePayloadDto) {
        try {
            const alreadExists = await this.ClientModel.findOne({
                _id: new mongodb_1.ObjectId(id),
                contacts_id: new mongodb_1.ObjectId(contactUpdatePayloadDto.contact_id),
            });
            if (alreadExists) {
                const res = await this.ClientModel.findOneAndUpdate({
                    _id: id,
                }, {
                    $pull: {
                        contacts_id: contactUpdatePayloadDto.contact_id,
                    },
                }, { new: true, overwrite: false });
                if (!res) {
                    throw new apiError_1.ServiceError('Failed To Update Contact', common_1.HttpStatus.BAD_REQUEST);
                }
                return this.mapper.map(res, client_model_1.ClientModel, Client_1.ClientCompleteResponseDto);
            }
            const res = await this.ClientModel.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $push: {
                    contacts_id: [contactUpdatePayloadDto.contact_id],
                },
            }, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError('Failed To Update Contact', common_1.HttpStatus.BAD_REQUEST);
            }
            return this.mapper.map(res, client_model_1.ClientModel, Client_1.ClientCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, [
                    'name',
                    'client_type',
                    'address_1',
                    'address_2',
                    'city',
                    'state',
                    'zip',
                ]);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.ClientModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.ClientModel.aggregate([
                { $match: queryConditions },
                {
                    $sort: { _id: -1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: pagination.limit == 0
                        ? totalCount === 0
                            ? 10
                            : totalCount
                        : pagination.limit,
                },
                {
                    $lookup: {
                        from: 'projectmodels',
                        localField: '_id',
                        foreignField: 'client.client_id',
                        as: 'project',
                    },
                },
                {
                    $addFields: {
                        total_projects: { $size: '$project' },
                    },
                },
                {
                    $project: {
                        project: 0,
                    },
                },
            ]);
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, client_model_1.ClientModel, ClientPartial_1.ClientPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.ClientModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
ClientManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], ClientManagerService);
exports.ClientManagerService = ClientManagerService;


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("@nestjs/common/services");

/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class ClientCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ClientCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], ClientCompleteResponseDto.prototype, "contacts_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "client_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], ClientCompleteResponseDto.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientCompleteResponseDto.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], ClientCompleteResponseDto.prototype, "company_manager", void 0);
exports.ClientCompleteResponseDto = ClientCompleteResponseDto;


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class ClientPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ClientPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], ClientPartialResponseDto.prototype, "contacts_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "client_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], ClientPartialResponseDto.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ClientPartialResponseDto.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], ClientPartialResponseDto.prototype, "total_projects", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], ClientPartialResponseDto.prototype, "company_manager", void 0);
exports.ClientPartialResponseDto = ClientPartialResponseDto;


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getQueryConditions = exports.createQueryparams = void 0;
function createQueryparams(query, fields) {
    let conditions = [];
    const page = parseInt(query.page);
    const pagination = {
        limit: parseInt(query.limit ? query.limit : '0'),
        page: !page || page === 0 ? 1 : page,
    };
    if (query.keyword) {
        for (const field of fields) {
            conditions.push({
                [field]: { $regex: query.keyword, $options: 'i' },
            });
        }
    }
    if (conditions.length < 1) {
        conditions = [{}];
    }
    return { pagination, conditions };
}
exports.createQueryparams = createQueryparams;
function getQueryConditions(conditions) {
    const $or = [];
    if (conditions && conditions.length > 0) {
        conditions.forEach((condition) => {
            $or.push(condition);
        });
    }
    return $or;
}
exports.getQueryConditions = getQueryConditions;


/***/ }),
/* 41 */
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientModelSchema = exports.ClientModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let ClientModel = class ClientModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ClientModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    name: v,
                });
                return count === 0;
            },
            message: 'name must be unique',
        },
    }),
    __metadata("design:type", String)
], ClientModel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], ClientModel.prototype, "contacts_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ClientModel.prototype, "client_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ClientModel.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ClientModel.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ClientModel.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId], default: [] }),
    __metadata("design:type", Array)
], ClientModel.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ClientModel.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ClientModel.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], ClientModel.prototype, "total_projects", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], ClientModel.prototype, "company_manager", void 0);
ClientModel = __decorate([
    (0, mongoose_1.Schema)()
], ClientModel);
exports.ClientModel = ClientModel;
exports.ClientModelSchema = mongoose_1.SchemaFactory.createForClass(ClientModel);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationTemplateManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const CommunicationTemplate_1 = __webpack_require__(44);
const CommuniccationTemplatePartial_1 = __webpack_require__(46);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const communication_template_model_1 = __webpack_require__(45);
let CommunicationTemplateManagerService = class CommunicationTemplateManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, communicationTemplateModel) {
        super(mapper);
        this.mapper = mapper;
        this.communicationTemplateModel = communicationTemplateModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, communication_template_model_1.CommunicationTemplateModel, CommunicationTemplate_1.CommunicationTemplateCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)));
            (0, core_1.createMap)(mapper, communication_template_model_1.CommunicationTemplateModel, CommuniccationTemplatePartial_1.CommunicationTemplatePartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)));
        };
    }
    async create(communicationTemplatePayload) {
        try {
            const res = await this.communicationTemplateModel.create(communicationTemplatePayload);
            return this.mapper.map(res, communication_template_model_1.CommunicationTemplateModel, CommunicationTemplate_1.CommunicationTemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async findOne(conditions) {
        try {
            const res = await this.communicationTemplateModel.findOne(Object.assign(Object.assign({}, conditions), { active: true }));
            return this.mapper.map(res, communication_template_model_1.CommunicationTemplateModel, CommunicationTemplate_1.CommunicationTemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async find(conditions) {
        try {
            const res = await this.communicationTemplateModel.find(Object.assign(Object.assign({}, conditions), { active: true }));
            return this.mapper.mapArray(res, communication_template_model_1.CommunicationTemplateModel, CommunicationTemplate_1.CommunicationTemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            const pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, class_validator_1.isEmpty)(query)) {
                const queryParams = (0, queryParams_1.createQueryparams)(query, [
                    'template_name',
                    'template_type',
                    'subject',
                ]);
                const conditions = queryParams.conditions;
                pagination.limit = queryParams.pagination.limit;
                pagination.page = queryParams.pagination.page;
                const $or = [];
                if (conditions && conditions.length > 0) {
                    conditions.forEach(condition => {
                        $or.push(condition);
                    });
                }
                if ($or.length > 0) {
                    queryConditions.$or = $or;
                }
            }
            const totalCount = await this.communicationTemplateModel
                .find(Object.assign(Object.assign({}, queryConditions), { active: true }))
                .count();
            const skip = pagination.limit * (pagination.page - 1);
            const data = await this.communicationTemplateModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, queryConditions), { active: true }),
                },
                {
                    $lookup: {
                        from: 'usermodels',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by',
                    },
                },
                {
                    $unwind: {
                        path: '$created_by',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        template_name: 1,
                        template_type: 1,
                        template: 1,
                        subject: 1,
                        system_generated: 1,
                        'created_by._id': 1,
                        'created_by.email': 1,
                        'created_by.first_name': 1,
                        'created_by.last_name': 1,
                        tags: 1,
                    },
                },
                {
                    $sort: { _id: -1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: pagination.limit == 0
                        ? totalCount === 0
                            ? 10
                            : totalCount
                        : pagination.limit,
                },
            ]);
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const dbResponse = await this.communicationTemplateModel.aggregate([
                {
                    $match: { _id: new mongodb_1.ObjectId(id), active: true },
                },
                {
                    $lookup: {
                        from: 'usermodels',
                        localField: 'created_by',
                        foreignField: '_id',
                        as: 'created_by',
                    },
                },
                {
                    $unwind: {
                        path: '$created_by',
                    },
                },
                {
                    $project: {
                        _id: 1,
                        template_name: 1,
                        template_type: 1,
                        template: 1,
                        subject: 1,
                        system_generated: 1,
                        'created_by._id': 1,
                        'created_by.email': 1,
                        'created_by.first_name': 1,
                        'created_by.last_name': 1,
                        tags: 1,
                    },
                },
            ]);
            return this.mapper.map(dbResponse[0], communication_template_model_1.CommunicationTemplateModel, CommunicationTemplate_1.CommunicationTemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            if (updatePayloadDto.template_type) {
                const res = await this.communicationTemplateModel.findOne({
                    _id: id,
                    system_generated: true,
                });
                if (res) {
                    throw new apiError_1.ServiceError('Template type of system generated templates can not be updated', common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const res = await this.communicationTemplateModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, communication_template_model_1.CommunicationTemplateModel, CommuniccationTemplatePartial_1.CommunicationTemplatePartialResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.communicationTemplateModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async softDelete(id) {
        try {
            const res = await this.communicationTemplateModel.findOneAndUpdate({
                _id: id,
                active: true,
                system_generated: false,
            }, {
                active: false,
            }, {
                new: true,
                overwrite: false,
            });
            if (!res) {
                throw new apiError_1.ServiceError('Communication Template not found', common_1.HttpStatus.NOT_FOUND);
            }
            return common_1.HttpStatus.NO_CONTENT;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
CommunicationTemplateManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(communication_template_model_1.CommunicationTemplateModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], CommunicationTemplateManagerService);
exports.CommunicationTemplateManagerService = CommunicationTemplateManagerService;


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationTemplateCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const communication_template_model_1 = __webpack_require__(45);
const mongodb_1 = __webpack_require__(25);
class CommunicationTemplateCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CommunicationTemplateCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplateCompleteResponseDto.prototype, "template_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplateCompleteResponseDto.prototype, "template_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplateCompleteResponseDto.prototype, "template", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplateCompleteResponseDto.prototype, "subject", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], CommunicationTemplateCompleteResponseDto.prototype, "system_generated", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], CommunicationTemplateCompleteResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => communication_template_model_1.EntitiesInvolved),
    __metadata("design:type", Array)
], CommunicationTemplateCompleteResponseDto.prototype, "tags", void 0);
exports.CommunicationTemplateCompleteResponseDto = CommunicationTemplateCompleteResponseDto;


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationTemplateModelSchema = exports.CommunicationTemplateModel = exports.EntitiesInvolved = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let EntitiesInvolved = class EntitiesInvolved {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], EntitiesInvolved.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], EntitiesInvolved.prototype, "resolve_to", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], EntitiesInvolved.prototype, "entity_type", void 0);
EntitiesInvolved = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], EntitiesInvolved);
exports.EntitiesInvolved = EntitiesInvolved;
const EntitySchema = mongoose_1.SchemaFactory.createForClass(EntitiesInvolved);
let CommunicationTemplateModel = class CommunicationTemplateModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CommunicationTemplateModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], CommunicationTemplateModel.prototype, "template_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], CommunicationTemplateModel.prototype, "template_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], CommunicationTemplateModel.prototype, "template", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], CommunicationTemplateModel.prototype, "subject", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], CommunicationTemplateModel.prototype, "created_by", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [EntitySchema], required: true }),
    __metadata("design:type", Array)
], CommunicationTemplateModel.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], CommunicationTemplateModel.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], CommunicationTemplateModel.prototype, "system_generated", void 0);
CommunicationTemplateModel = __decorate([
    (0, mongoose_1.Schema)()
], CommunicationTemplateModel);
exports.CommunicationTemplateModel = CommunicationTemplateModel;
exports.CommunicationTemplateModelSchema = mongoose_1.SchemaFactory.createForClass(CommunicationTemplateModel);


/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationTemplatePartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const communication_template_model_1 = __webpack_require__(45);
const mongodb_1 = __webpack_require__(25);
class CommunicationTemplatePartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CommunicationTemplatePartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplatePartialResponseDto.prototype, "template_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplatePartialResponseDto.prototype, "template_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplatePartialResponseDto.prototype, "template", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationTemplatePartialResponseDto.prototype, "subject", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], CommunicationTemplatePartialResponseDto.prototype, "system_generated", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], CommunicationTemplatePartialResponseDto.prototype, "created_by", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => communication_template_model_1.EntitiesInvolved),
    __metadata("design:type", Array)
], CommunicationTemplatePartialResponseDto.prototype, "tags", void 0);
exports.CommunicationTemplatePartialResponseDto = CommunicationTemplatePartialResponseDto;


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const Contact_1 = __webpack_require__(29);
const ContactPartial_1 = __webpack_require__(48);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongoose_2 = __webpack_require__(28);
const contact_model_1 = __webpack_require__(49);
let ContactManagerService = class ContactManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, ContactModel) {
        super(mapper);
        this.mapper = mapper;
        this.ContactModel = ContactModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, contact_model_1.ContactModel, Contact_1.ContactCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, contact_model_1.ContactModel, ContactPartial_1.ContactPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.ContactModel.create(createPayloadDto);
            return this.mapper.map(res, contact_model_1.ContactModel, Contact_1.ContactCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.ContactModel.findById(id);
            return this.mapper.map(res, contact_model_1.ContactModel, Contact_1.ContactCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.ContactModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, contact_model_1.ContactModel, Contact_1.ContactCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['first_name', 'last_name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.ContactModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.ContactModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, contact_model_1.ContactModel, ContactPartial_1.ContactPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async find(conditions) {
        try {
            const res = await this.ContactModel.find(conditions);
            return this.mapper.mapArray(res, contact_model_1.ContactModel, Contact_1.ContactCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.ContactModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
ContactManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(contact_model_1.ContactModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], ContactManagerService);
exports.ContactManagerService = ContactManagerService;


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class ContactPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ContactPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "title", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "address_3", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "fax", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "direct", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "mobile", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ContactPartialResponseDto.prototype, "contact_type", void 0);
exports.ContactPartialResponseDto = ContactPartialResponseDto;


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContactModelSchema = exports.ContactModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
let ContactModel = class ContactModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ContactModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "company_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "title", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    email: v,
                });
                return count === 0;
            },
            message: 'email must be unique',
        },
    }),
    __metadata("design:type", String)
], ContactModel.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "address_3", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "fax", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "direct", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ContactModel.prototype, "mobile", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ContactModel.prototype, "contact_type", void 0);
ContactModel = __decorate([
    (0, mongoose_1.Schema)()
], ContactModel);
exports.ContactModel = ContactModel;
exports.ContactModelSchema = mongoose_1.SchemaFactory.createForClass(ContactModel);


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OtpManagerService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(13);
const mongoose_1 = __webpack_require__(19);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const contact_model_1 = __webpack_require__(49);
const otp_model_1 = __webpack_require__(51);
const EmailService_1 = __webpack_require__(52);
const mongoose_2 = __webpack_require__(28);
const assign_project_service_1 = __webpack_require__(54);
const compliance_service_1 = __webpack_require__(55);
let OtpManagerService = class OtpManagerService {
    constructor(contactModel, otpModel, assignProjectService, jwtService, complianceService, emailService) {
        this.contactModel = contactModel;
        this.otpModel = otpModel;
        this.assignProjectService = assignProjectService;
        this.jwtService = jwtService;
        this.complianceService = complianceService;
        this.emailService = emailService;
        this.logger = new common_1.Logger();
    }
    async generateOTP(otpGeneratePayload) {
        try {
            const assignedProject = await this.assignProjectService.findOne({
                uuid: otpGeneratePayload.uuid,
            });
            if (!assignedProject) {
                throw new apiError_1.ServiceError('Project may have been deleted', common_1.HttpStatus.BAD_REQUEST);
            }
            const compliance = await this.complianceService.findOne({
                _id: assignedProject.compliance_id,
            });
            if (!compliance || !compliance.status) {
                throw new apiError_1.ServiceError('Project may have been deleted', common_1.HttpStatus.BAD_REQUEST);
            }
            const contact = await this.contactModel.findById({
                _id: assignedProject.contact_id,
            });
            if (!contact) {
                throw new apiError_1.ServiceError('Your account may have been deleted', common_1.HttpStatus.BAD_REQUEST);
            }
            await this.otpModel.deleteMany({
                email: contact.email,
            });
            const randomSixDigitCode = Math.random().toString().substr(2, 6);
            const otpCreate = {
                email: contact.email,
                contact_id: assignedProject === null || assignedProject === void 0 ? void 0 : assignedProject.contact_id,
                otp: randomSixDigitCode,
                project_assignee: assignedProject === null || assignedProject === void 0 ? void 0 : assignedProject.contact_id,
            };
            const newOTP = await this.otpModel.create(otpCreate);
            const mailOptions = {
                to: contact.email,
                subject: 'OTP for Login',
                html: `<p>Dear user, Please use the following OTP code to login into your account ${newOTP.otp}</p>`,
            };
            this.emailService.sendEmail(mailOptions);
            return {
                message: 'OTP Sent to Your Registered Email',
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async validateOTP(otpVerifyPayload) {
        try {
            const assignedProject = await this.assignProjectService.findOne({
                uuid: otpVerifyPayload.uuid,
            });
            if (!assignedProject) {
                throw new apiError_1.ServiceError('Project may have been deleted', common_1.HttpStatus.BAD_REQUEST);
            }
            const res = await this.otpModel.findOne({
                contact_id: assignedProject.contact_id,
            });
            if (!res) {
                throw new apiError_1.ServiceError('OTP expired, Generate a new One Time Password(OTP)', common_1.HttpStatus.BAD_REQUEST);
            }
            if (otpVerifyPayload.otp === res.otp) {
                const projectAssignee = await this.contactModel.findOne({
                    email: res.email,
                });
                if (!projectAssignee) {
                    throw new apiError_1.ServiceError('Invalid Account', common_1.HttpStatus.BAD_REQUEST);
                }
                await this.otpModel.deleteMany({
                    email: projectAssignee.email,
                });
                const access_token = await this.generateAccessToken(projectAssignee.toJSON());
                return access_token;
            }
            throw new apiError_1.ServiceError('Incorrect OTP', common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async generateAccessToken(payload) {
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
            }),
        };
    }
};
OtpManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contact_model_1.ContactModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(otp_model_1.OTPModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof assign_project_service_1.IAssignProjectService !== "undefined" && assign_project_service_1.IAssignProjectService) === "function" ? _c : Object, typeof (_d = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _d : Object, typeof (_e = typeof compliance_service_1.IComplianceService !== "undefined" && compliance_service_1.IComplianceService) === "function" ? _e : Object, typeof (_f = typeof EmailService_1.EmailService !== "undefined" && EmailService_1.EmailService) === "function" ? _f : Object])
], OtpManagerService);
exports.OtpManagerService = OtpManagerService;


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OTPModelSchema = exports.OTPModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let OTPModel = class OTPModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], OTPModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    email: v,
                });
                return count === 0;
            },
            message: 'email must be unique',
        },
    }),
    __metadata("design:type", String)
], OTPModel.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], OTPModel.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], OTPModel.prototype, "attempts", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], OTPModel.prototype, "otp", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], OTPModel.prototype, "project_assignee", void 0);
OTPModel = __decorate([
    (0, mongoose_1.Schema)()
], OTPModel);
exports.OTPModel = OTPModel;
exports.OTPModelSchema = mongoose_1.SchemaFactory.createForClass(OTPModel);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(1);
const nodemailer_1 = __webpack_require__(53);
let EmailService = class EmailService {
    constructor() {
        this.logger = new common_1.Logger();
        this.transporter = (0, nodemailer_1.createTransport)({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_SMTP_PORT),
            secure: Boolean(process.env.EMAIL_SECURE),
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    async sendEmail(options) {
        const { to, subject } = options;
        let { html } = options;
        const header = '<div style="width:100%;"><img style="margin:auto; display:flex;" src="https://i.ibb.co/kXkx6Vz/Logo-Black.png" alt="logo" /></div>';
        html = header + html;
        try {
            const message = {
                from: process.env.EMAIL_USERNAME,
                to,
                subject,
                html,
            };
            await this.transporter.sendMail(message);
        }
        catch (err) {
            common_1.Logger.log('Error sending email...');
        }
    }
};
EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
exports.EmailService = EmailService;


/***/ }),
/* 53 */
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IAssignProjectService = void 0;
class IAssignProjectService {
}
exports.IAssignProjectService = IAssignProjectService;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IComplianceService = void 0;
class IComplianceService {
}
exports.IComplianceService = IComplianceService;


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(57);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(58);
const Project_1 = __webpack_require__(26);
const ProjectPartial_1 = __webpack_require__(59);
const apiError_1 = __webpack_require__(31);
const enum_1 = __webpack_require__(60);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const bullmq_2 = __webpack_require__(61);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const assign_project_model_1 = __webpack_require__(35);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
let ProjectManagerService = class ProjectManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, ProjectModel, ComplianceModel, vendorComplianceQueue, AssignProjectModel) {
        super(mapper);
        this.mapper = mapper;
        this.ProjectModel = ProjectModel;
        this.ComplianceModel = ComplianceModel;
        this.vendorComplianceQueue = vendorComplianceQueue;
        this.AssignProjectModel = AssignProjectModel;
        this.getUpdateFields = (updatePayload, dbField) => {
            const updateFields = {};
            const items = {
                comments: updatePayload.comments,
                status: updatePayload.status,
                vers_date: updatePayload.vers_date,
            };
            Object.keys(items).forEach(key => {
                if (items[key]) {
                    updateFields[`${dbField}.$.${key}`] = items[key];
                }
            });
            return updateFields;
        };
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, project_model_1.ProjectModel, ProjectPartial_1.ProjectPartialResponseDTO, (0, core_1.forMember)(d => d.client, (0, core_1.mapFrom)(s => s.client)), (0, core_1.forMember)(d => d.manager, (0, core_1.mapFrom)(s => s.manager)), (0, core_1.forMember)(d => d.documents, (0, core_1.mapFrom)(s => s.documents)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)), (0, core_1.forMember)(d => d.assigned_vendor_count, (0, core_1.mapFrom)(s => s.assigned_vendor.length)));
            (0, core_1.createMap)(mapper, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO, (0, core_1.forMember)(d => d.client, (0, core_1.mapFrom)(s => s.client)), (0, core_1.forMember)(d => d.manager, (0, core_1.mapFrom)(s => s.manager)), (0, core_1.forMember)(d => d.documents, (0, core_1.mapFrom)(s => s.documents)), (0, core_1.forMember)(d => d.contacts, (0, core_1.mapFrom)(s => s.contacts)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)), (0, core_1.forMember)(d => d.certificate_holders, (0, core_1.mapFrom)(s => s.certificate_holders)), (0, core_1.forMember)(d => d.parties_to_the_transaction, (0, core_1.mapFrom)(s => s.parties_to_the_transaction)), (0, core_1.forMember)(d => d.assigned_vendor, (0, core_1.mapFrom)(s => s.assigned_vendor)), (0, core_1.forMember)(d => d.deal_summary, (0, core_1.mapFrom)(s => s.deal_summary)), (0, core_1.forMember)(d => d.project_schedule, (0, core_1.mapFrom)(s => s.project_schedule)), (0, core_1.forMember)(d => d.material_documents, (0, core_1.mapFrom)(s => s.material_documents)), (0, core_1.forMember)(d => d.certificates, (0, core_1.mapFrom)(s => s.certificates)));
        };
    }
    async create(projectCreatorDto) {
        try {
            const projectData = Object.assign(Object.assign({}, projectCreatorDto), { material_documents: constants_1.MATERIAL_DOCS, certificates: constants_1.CERTIFICATES });
            const res = await this.ProjectModel.create(projectData);
            return this.mapper.map(res, project_model_1.ProjectModel, ProjectPartial_1.ProjectPartialResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['client.name', 'name', 'manager.name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.ProjectModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.ProjectModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, project_model_1.ProjectModel, ProjectPartial_1.ProjectPartialResponseDTO);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.ProjectModel.aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contacts',
                        foreignField: '_id',
                        as: 'contacts',
                    },
                },
                {
                    $lookup: {
                        from: 'tagmodels',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags',
                    },
                },
            ]);
            return this.mapper.map(res[0], project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.ProjectModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.ProjectModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async addVendorAssignment(id, updatePayload, user) {
        try {
            const project = await this.ProjectModel.findOne({
                _id: id,
            }).select(['assigned_vendor', 'client']);
            if (!project) {
                throw new apiError_1.ServiceError('Not Found', common_1.HttpStatus.BAD_REQUEST);
            }
            const existingVendor = await this.ProjectModel.findOne({
                _id: id,
                'assigned_vendor.vendor_id': updatePayload.vendor_id,
            });
            if (existingVendor) {
                throw new apiError_1.ServiceError('Vendor Compliance Already exist for this Project!', common_1.HttpStatus.BAD_REQUEST);
            }
            const res = await this.ProjectModel.findByIdAndUpdate({ _id: id }, { $push: { assigned_vendor: updatePayload } }, { new: true });
            if (!res) {
                throw new apiError_1.ServiceError('Not Found', common_1.HttpStatus.BAD_REQUEST);
            }
            const complianceData = {
                project_id: new mongodb_1.ObjectId(id),
                project_name: res.name,
                requirement_group_id: updatePayload.requirement_group_id,
                vendor_id: updatePayload.vendor_id,
                vendor_name: updatePayload.vendor_name,
                client_id: new mongodb_1.ObjectId(project === null || project === void 0 ? void 0 : project.client.client_id),
                client_name: project === null || project === void 0 ? void 0 : project.client.name,
                user_id: user.userId,
            };
            await this.vendorComplianceQueue.add(constants_1.VENDOR_COMPLIANCE_QUEUE, Object.assign({}, complianceData));
            return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async removeVendorAssignment(id, updatePayload) {
        try {
            const project = await this.ProjectModel.findOne({
                _id: id,
            }).select('assigned_vendor');
            if (!project) {
                throw new apiError_1.ServiceError('Project Not Found', common_1.HttpStatus.NOT_FOUND);
            }
            const vendor_to_remove = project === null || project === void 0 ? void 0 : project.assigned_vendor.find(vendor => vendor._id.toString() ===
                updatePayload.vendor_assignement_id.toString());
            if (!vendor_to_remove) {
                throw new apiError_1.ServiceError(`Vendor Not Found`, common_1.HttpStatus.NOT_FOUND);
            }
            const res = await this.ProjectModel.findOneAndUpdate({ _id: id }, {
                $pull: {
                    assigned_vendor: { _id: updatePayload.vendor_assignement_id },
                },
            }, { new: true, overwrite: false });
            const compliance = await this.ComplianceModel.findOneAndUpdate({
                vendor_id: vendor_to_remove === null || vendor_to_remove === void 0 ? void 0 : vendor_to_remove.vendor_id,
                requirement_group_id: vendor_to_remove === null || vendor_to_remove === void 0 ? void 0 : vendor_to_remove.requirement_group_id,
                project_id: id,
                status: true,
            }, {
                $set: {
                    status: false,
                },
            });
            if (!compliance) {
                await this.AssignProjectModel.deleteMany({
                    vendor_id: vendor_to_remove === null || vendor_to_remove === void 0 ? void 0 : vendor_to_remove.vendor_id,
                    requirement_group_id: vendor_to_remove === null || vendor_to_remove === void 0 ? void 0 : vendor_to_remove.requirement_group_id,
                    project_id: id,
                });
            }
            return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateMaterialDocsAndCerts(id, updatePayload) {
        try {
            const updateFields = this.getUpdateFields(updatePayload, updatePayload.type);
            const condition = {};
            updatePayload.type === enum_1.MATERIAL_DOCS_CERTS_UPDATE_ENUM.MATERIAL_DOCS
                ? (condition[`${enum_1.MATERIAL_DOCS_CERTS_UPDATE_ENUM.MATERIAL_DOCS}._id`] =
                    new mongodb_1.ObjectId(updatePayload._id))
                : (condition[`${enum_1.MATERIAL_DOCS_CERTS_UPDATE_ENUM.CERTS}._id`] =
                    new mongodb_1.ObjectId(updatePayload._id));
            const project = await this.ProjectModel.findOneAndUpdate(Object.assign({ _id: id }, condition), {
                $set: Object.assign({}, updateFields),
            }, { new: true });
            return this.mapper.map(project, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getByClientId(client_id) {
        try {
            const res = await this.ProjectModel.aggregate([
                {
                    $match: {
                        'client.client_id': new mongodb_1.ObjectId(client_id),
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contacts',
                        foreignField: '_id',
                        as: 'contacts',
                    },
                },
            ]);
            return this.mapper.mapArray(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async contactAssignment(id, updatePayload) {
        try {
            const project = await this.ProjectModel.findOne({
                _id: id,
            }).select('contacts');
            if (project === null || project === void 0 ? void 0 : project.contacts.find(contact => contact.toString() === updatePayload._id.toString())) {
                throw new apiError_1.ServiceError('Contact already exist for this Project', common_1.HttpStatus.BAD_REQUEST);
            }
            const res = await this.ProjectModel.findByIdAndUpdate({ _id: id }, { $push: { contacts: updatePayload._id } }, { new: true });
            return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async removeContactAssignment(id, updatePayload) {
        try {
            const project = await this.ProjectModel.findOne({
                _id: id,
            }).select('contacts');
            if (!project) {
                throw new apiError_1.ServiceError('Project Not Found', common_1.HttpStatus.NOT_FOUND);
            }
            const contacts_to_remove = project === null || project === void 0 ? void 0 : project.contacts.find(contact => contact.toString() === updatePayload._id.toString());
            if (!contacts_to_remove) {
                throw new apiError_1.ServiceError(`Contact Not Found`, common_1.HttpStatus.NOT_FOUND);
            }
            const res = await this.ProjectModel.findOneAndUpdate({ _id: id }, {
                $pull: {
                    contacts: updatePayload._id,
                },
            }, { new: true, overwrite: false });
            return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAssignedContacts(project_id) {
        try {
            const response = await this.ProjectModel.aggregate([
                {
                    $match: {
                        _id: {
                            $in: project_id.project_id.map(id => new mongodb_1.ObjectId(id)),
                        },
                    },
                },
                {
                    $unwind: '$assigned_vendor',
                },
                {
                    $lookup: {
                        from: 'vendormodels',
                        localField: 'assigned_vendor.vendor_id',
                        foreignField: '_id',
                        as: 'vendor',
                    },
                },
                {
                    $unwind: '$vendor',
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'vendor.contacts_id',
                        foreignField: '_id',
                        as: 'contact_details',
                    },
                },
                {
                    $unwind: '$contact_details',
                },
                {
                    $project: {
                        _id: '$contact_details._id',
                        first_name: '$contact_details.first_name',
                        last_name: '$contact_details.last_name',
                        company_name: '$contact_details.company_name',
                        type: '$contact_details.type',
                    },
                },
            ]);
            const result = await this.ProjectModel.aggregate([
                {
                    $match: {
                        _id: {
                            $in: project_id.project_id.map(id => new mongodb_1.ObjectId(id)),
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contacts',
                        foreignField: '_id',
                        as: 'contactsInfo',
                    },
                },
                {
                    $unwind: '$contactsInfo',
                },
                {
                    $project: {
                        _id: '$contactsInfo._id',
                        first_name: '$contactsInfo.first_name',
                        last_name: '$contactsInfo.last_name',
                        company_name: '$contactsInfo.company_name',
                        type: '$contactsInfo.type',
                    },
                },
            ]);
            const res = response.concat(result);
            return res;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async assignContacts(id, contactUpdatePayloadDto) {
        try {
            const alreadyExists = await this.ProjectModel.findOne({
                _id: new mongodb_1.ObjectId(id),
                contacts: new mongodb_1.ObjectId(contactUpdatePayloadDto.contact_id),
            });
            if (alreadyExists) {
                const res = await this.ProjectModel.findOneAndUpdate({
                    _id: id,
                }, {
                    $pull: {
                        contacts: contactUpdatePayloadDto.contact_id,
                    },
                }, { new: true, overwrite: false });
                if (!res) {
                    throw new apiError_1.ServiceError('Failed To Update Contact', common_1.HttpStatus.BAD_REQUEST);
                }
                return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
            }
            const res = await this.ProjectModel.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $push: {
                    contacts: [contactUpdatePayloadDto.contact_id],
                },
            }, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError('Failed To Update Contact', common_1.HttpStatus.BAD_REQUEST);
            }
            return this.mapper.map(res, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getVendorProjects(id) {
        try {
            const projects = await this.ProjectModel.find({
                'assigned_vendor.vendor_id': id,
            });
            return this.mapper.mapArray(projects, project_model_1.ProjectModel, ProjectPartial_1.ProjectPartialResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateNotes(id, projectNotesPayload) {
        try {
            const project = await this.ProjectModel.findOneAndUpdate({ _id: id }, { notes: projectNotesPayload.notes }, { new: true, overwrite: false });
            return this.mapper.map(project, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateWaiver(id, projectWaiverPayload) {
        try {
            const project = await this.ProjectModel.findOneAndUpdate({ _id: id }, { waivers: projectWaiverPayload.waiver }, { new: true, overwrite: false });
            return this.mapper.map(project, project_model_1.ProjectModel, Project_1.ProjectCompleteResponseDTO);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
ProjectManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(3, (0, bullmq_1.InjectQueue)(constants_1.VENDOR_COMPLIANCE_QUEUE)),
    __param(4, (0, mongoose_1.InjectModel)(assign_project_model_1.AssignProjectModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], ProjectManagerService);
exports.ProjectManagerService = ProjectManagerService;


/***/ }),
/* 57 */
/***/ ((module) => {

module.exports = require("@nestjs/bullmq");

/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.config = exports.CERTIFICATES = exports.MATERIAL_DOCS = exports.AUTO_NOTIFICATION_QUEUE = exports.TEMPLATE_UPDATE_QUEUE = exports.COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE = exports.COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE = exports.ESCALATION_QUEUE = exports.MAILER_QUEUE = exports.PROJECT_ASSIGNEE_QUEUE = exports.VENDOR_COMPLIANCE_QUEUE = void 0;
exports.VENDOR_COMPLIANCE_QUEUE = 'VENDOR_COMPLIANCE_QUEUE';
exports.PROJECT_ASSIGNEE_QUEUE = 'PROJECT_ASSIGNEE_QUEUE';
exports.MAILER_QUEUE = 'MAILER_QUEUE';
exports.ESCALATION_QUEUE = 'ESCALATION_QUEUE';
exports.COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE = 'COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE';
exports.COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE = 'COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE';
exports.TEMPLATE_UPDATE_QUEUE = 'TEMPLATE_UPDATE_QUEUE';
exports.AUTO_NOTIFICATION_QUEUE = 'AUTO_NOTIFICATION_QUEUE';
exports.MATERIAL_DOCS = [
    {
        name: 'Exce Summary',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Org Chart',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Hard Cost',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Soft Cost',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Rental Income',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Term Con',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'GC Contact',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'GP Contact',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'GP/Bkr Conf Call',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Investment Contact',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Insurance Req',
        vers_date: '',
        comments: '',
        status: 'R',
    },
];
exports.CERTIFICATES = [
    {
        name: "Builder's Risk",
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Gen Partner - GL',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Gen Partner - Umb',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Gen Contractor - GL',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Gen Contractor - Umb',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Gen Contractor - Auto',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Gen Contractor - WC',
        vers_date: '',
        comments: '',
        status: 'R',
    },
    {
        name: 'Permanent Insurance Quote',
        vers_date: '',
        comments: '',
        status: 'R',
    },
];
exports.config = {
    one_min: '*/1 * * * *',
    five_min: '*/5 * * * *',
    ten_min: '*/10 * * * *',
    thirty_min: '*/30 * * * *',
    midnight: '0 0 * * *',
};


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectPartialResponseDTO = void 0;
const classes_1 = __webpack_require__(21);
const project_model_1 = __webpack_require__(27);
const mongodb_1 = __webpack_require__(25);
class ProjectPartialResponseDTO {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ProjectPartialResponseDTO.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.Client),
    __metadata("design:type", typeof (_b = typeof project_model_1.Client !== "undefined" && project_model_1.Client) === "function" ? _b : Object)
], ProjectPartialResponseDTO.prototype, "client", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], ProjectPartialResponseDTO.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.Document),
    __metadata("design:type", Array)
], ProjectPartialResponseDTO.prototype, "documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], ProjectPartialResponseDTO.prototype, "assigned_vendor_count", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => project_model_1.Manager),
    __metadata("design:type", typeof (_c = typeof project_model_1.Manager !== "undefined" && project_model_1.Manager) === "function" ? _c : Object)
], ProjectPartialResponseDTO.prototype, "manager", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], ProjectPartialResponseDTO.prototype, "tags", void 0);
exports.ProjectPartialResponseDTO = ProjectPartialResponseDTO;


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.COMMUNICATION_RECIPIENT_TYPE = exports.COMMUNICATION_TYPE = exports.AUTO_NOTIFICATION_COMPLIANCE_STATUS = exports.AUTO_NOTIFICATION_ENTITIES = exports.MATERIAL_DOCS_CERTS_UPDATE_ENUM = exports.TEMPLATE_TYPE_QUERY_ENUM = exports.COMPLIANCE_UPDATE_TEMPLATES = exports.USER_ROLE_ENUM = exports.TEMPLATE_RULE_CONDITION_ENUM = exports.PROJECT_DOCUMENT_TYPE_ENUM = exports.CONTACT_TYPE_CATEGORY_ENUM = exports.CONTACT_TYPE_ENUM = exports.COMPLIANCE_ITEM_TYPE_ENUM = exports.CLIENT_TYPE_ENUM = exports.COMPLIANCE_ITEM_STATUS_ENUM = void 0;
var COMPLIANCE_ITEM_STATUS_ENUM;
(function (COMPLIANCE_ITEM_STATUS_ENUM) {
    COMPLIANCE_ITEM_STATUS_ENUM["STATUS_WHITE"] = "W";
    COMPLIANCE_ITEM_STATUS_ENUM["STATUS_BLUE"] = "B";
    COMPLIANCE_ITEM_STATUS_ENUM["STATUS_GREEN"] = "G";
    COMPLIANCE_ITEM_STATUS_ENUM["STATUS_RED"] = "R";
    COMPLIANCE_ITEM_STATUS_ENUM["STATUS_YELLOW"] = "Y";
    COMPLIANCE_ITEM_STATUS_ENUM["STATUS_NA"] = "N/A";
})(COMPLIANCE_ITEM_STATUS_ENUM = exports.COMPLIANCE_ITEM_STATUS_ENUM || (exports.COMPLIANCE_ITEM_STATUS_ENUM = {}));
var CLIENT_TYPE_ENUM;
(function (CLIENT_TYPE_ENUM) {
    CLIENT_TYPE_ENUM["REAL_ESTATE_DEVELOPMENT"] = "Real Estate & Development";
    CLIENT_TYPE_ENUM["BANKING"] = "Banking";
})(CLIENT_TYPE_ENUM = exports.CLIENT_TYPE_ENUM || (exports.CLIENT_TYPE_ENUM = {}));
var COMPLIANCE_ITEM_TYPE_ENUM;
(function (COMPLIANCE_ITEM_TYPE_ENUM) {
    COMPLIANCE_ITEM_TYPE_ENUM["COMPLIANCE"] = "compliance";
    COMPLIANCE_ITEM_TYPE_ENUM["TEMPLATE"] = "template";
})(COMPLIANCE_ITEM_TYPE_ENUM = exports.COMPLIANCE_ITEM_TYPE_ENUM || (exports.COMPLIANCE_ITEM_TYPE_ENUM = {}));
var CONTACT_TYPE_ENUM;
(function (CONTACT_TYPE_ENUM) {
    CONTACT_TYPE_ENUM["UNDERWRITER"] = "Underwriter";
    CONTACT_TYPE_ENUM["LENDER"] = "Lender";
    CONTACT_TYPE_ENUM["PROPERTY_MANAGER"] = "Property Manager";
    CONTACT_TYPE_ENUM["BROKER"] = "Broker";
    CONTACT_TYPE_ENUM["GENERAL_PARTNER"] = "General Partner";
    CONTACT_TYPE_ENUM["GENERAL_PARTNER_BROKER"] = "General Partner Broker";
    CONTACT_TYPE_ENUM["GENERAL_CONTRACTOR"] = "General Contractor";
    CONTACT_TYPE_ENUM["GENERAL_CONTRACTOR_BROKER"] = "General Contractor Broker";
    CONTACT_TYPE_ENUM["INSURANCE_COMPANY"] = "Insurance Company";
    CONTACT_TYPE_ENUM["CLIENT"] = "Client";
    CONTACT_TYPE_ENUM["RISK_MANAGER"] = "Risk Manager";
})(CONTACT_TYPE_ENUM = exports.CONTACT_TYPE_ENUM || (exports.CONTACT_TYPE_ENUM = {}));
var CONTACT_TYPE_CATEGORY_ENUM;
(function (CONTACT_TYPE_CATEGORY_ENUM) {
    CONTACT_TYPE_CATEGORY_ENUM["CLIENT"] = "client";
    CONTACT_TYPE_CATEGORY_ENUM["PROJECT"] = "project";
    CONTACT_TYPE_CATEGORY_ENUM["VENDOR"] = "vendor";
})(CONTACT_TYPE_CATEGORY_ENUM = exports.CONTACT_TYPE_CATEGORY_ENUM || (exports.CONTACT_TYPE_CATEGORY_ENUM = {}));
var PROJECT_DOCUMENT_TYPE_ENUM;
(function (PROJECT_DOCUMENT_TYPE_ENUM) {
    PROJECT_DOCUMENT_TYPE_ENUM["EXECUTIVE_SUMMARY"] = "executive_summary";
    PROJECT_DOCUMENT_TYPE_ENUM["ENDORSEMENTS"] = "endorsements";
    PROJECT_DOCUMENT_TYPE_ENUM["INSURANCE_REQUIREMENT"] = "insurance_requirement";
    PROJECT_DOCUMENT_TYPE_ENUM["RISK_REPORT"] = "risk_report";
    PROJECT_DOCUMENT_TYPE_ENUM["ORGINAZTION_CHARTS"] = "organization_charts";
})(PROJECT_DOCUMENT_TYPE_ENUM = exports.PROJECT_DOCUMENT_TYPE_ENUM || (exports.PROJECT_DOCUMENT_TYPE_ENUM = {}));
var TEMPLATE_RULE_CONDITION_ENUM;
(function (TEMPLATE_RULE_CONDITION_ENUM) {
    TEMPLATE_RULE_CONDITION_ENUM["REQUIRED"] = "Required";
    TEMPLATE_RULE_CONDITION_ENUM["GREATER_THAN"] = "Greater than";
    TEMPLATE_RULE_CONDITION_ENUM["GREATER_THAN_OR_EQUAL"] = "Greater than or equal";
    TEMPLATE_RULE_CONDITION_ENUM["LESS_THAN"] = "Less than";
})(TEMPLATE_RULE_CONDITION_ENUM = exports.TEMPLATE_RULE_CONDITION_ENUM || (exports.TEMPLATE_RULE_CONDITION_ENUM = {}));
var USER_ROLE_ENUM;
(function (USER_ROLE_ENUM) {
    USER_ROLE_ENUM["ADMIN"] = "admin";
    USER_ROLE_ENUM["RISK_MANAGER"] = "risk_manager";
    USER_ROLE_ENUM["BROKER"] = "broker";
    USER_ROLE_ENUM["CONSULTANT"] = "consultant";
    USER_ROLE_ENUM["INSURER"] = "insurer";
})(USER_ROLE_ENUM = exports.USER_ROLE_ENUM || (exports.USER_ROLE_ENUM = {}));
var COMPLIANCE_UPDATE_TEMPLATES;
(function (COMPLIANCE_UPDATE_TEMPLATES) {
    COMPLIANCE_UPDATE_TEMPLATES["ADDED"] = "ADDED";
    COMPLIANCE_UPDATE_TEMPLATES["REMOVED"] = "REMOVED";
})(COMPLIANCE_UPDATE_TEMPLATES = exports.COMPLIANCE_UPDATE_TEMPLATES || (exports.COMPLIANCE_UPDATE_TEMPLATES = {}));
var TEMPLATE_TYPE_QUERY_ENUM;
(function (TEMPLATE_TYPE_QUERY_ENUM) {
    TEMPLATE_TYPE_QUERY_ENUM["ACCORD_25"] = "acord25";
    TEMPLATE_TYPE_QUERY_ENUM["ACCORD_28"] = "acord28";
})(TEMPLATE_TYPE_QUERY_ENUM = exports.TEMPLATE_TYPE_QUERY_ENUM || (exports.TEMPLATE_TYPE_QUERY_ENUM = {}));
var MATERIAL_DOCS_CERTS_UPDATE_ENUM;
(function (MATERIAL_DOCS_CERTS_UPDATE_ENUM) {
    MATERIAL_DOCS_CERTS_UPDATE_ENUM["MATERIAL_DOCS"] = "material_documents";
    MATERIAL_DOCS_CERTS_UPDATE_ENUM["CERTS"] = "certificates";
})(MATERIAL_DOCS_CERTS_UPDATE_ENUM = exports.MATERIAL_DOCS_CERTS_UPDATE_ENUM || (exports.MATERIAL_DOCS_CERTS_UPDATE_ENUM = {}));
var AUTO_NOTIFICATION_ENTITIES;
(function (AUTO_NOTIFICATION_ENTITIES) {
    AUTO_NOTIFICATION_ENTITIES["CLIENT"] = "client";
    AUTO_NOTIFICATION_ENTITIES["PROJECT"] = "project";
    AUTO_NOTIFICATION_ENTITIES["VENDOR"] = "vendor";
    AUTO_NOTIFICATION_ENTITIES["CONTACT"] = "contact";
})(AUTO_NOTIFICATION_ENTITIES = exports.AUTO_NOTIFICATION_ENTITIES || (exports.AUTO_NOTIFICATION_ENTITIES = {}));
var AUTO_NOTIFICATION_COMPLIANCE_STATUS;
(function (AUTO_NOTIFICATION_COMPLIANCE_STATUS) {
    AUTO_NOTIFICATION_COMPLIANCE_STATUS["COMPLIANT"] = "compliant";
    AUTO_NOTIFICATION_COMPLIANCE_STATUS["NOT_COMPLIANT_NOT_CRITICAL"] = "not_compliant_not_critical";
    AUTO_NOTIFICATION_COMPLIANCE_STATUS["NOT_COMPLIANT_CRITICAL"] = "not_compliant_critical";
})(AUTO_NOTIFICATION_COMPLIANCE_STATUS = exports.AUTO_NOTIFICATION_COMPLIANCE_STATUS || (exports.AUTO_NOTIFICATION_COMPLIANCE_STATUS = {}));
var COMMUNICATION_TYPE;
(function (COMMUNICATION_TYPE) {
    COMMUNICATION_TYPE["ONBOARDING"] = "onboarding";
    COMMUNICATION_TYPE["AUTO_NOTIFICATION"] = "auto_notification";
    COMMUNICATION_TYPE["ESCALATION"] = "escalation";
})(COMMUNICATION_TYPE = exports.COMMUNICATION_TYPE || (exports.COMMUNICATION_TYPE = {}));
var COMMUNICATION_RECIPIENT_TYPE;
(function (COMMUNICATION_RECIPIENT_TYPE) {
    COMMUNICATION_RECIPIENT_TYPE["PROJECT"] = "project";
    COMMUNICATION_RECIPIENT_TYPE["VENDOR"] = "vendor";
    COMMUNICATION_RECIPIENT_TYPE["CLIENT"] = "client";
})(COMMUNICATION_RECIPIENT_TYPE = exports.COMMUNICATION_RECIPIENT_TYPE || (exports.COMMUNICATION_RECIPIENT_TYPE = {}));


/***/ }),
/* 61 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplianceModelSchema = exports.ComplianceModel = exports.TemplateItems = exports.ComplianceItems = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const Project_1 = __webpack_require__(26);
const master_requirement_model_1 = __webpack_require__(33);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let ComplianceItems = class ComplianceItems {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ComplianceItems.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], ComplianceItems.prototype, "master_requirement_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "required_limit", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "actual_limit", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "status", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "comment", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ComplianceItems.prototype, "show", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ComplianceItems.prototype, "waiver", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], ComplianceItems.prototype, "post_closing", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "document_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "original_filename", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Date, required: false }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "effective_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Date, required: false }),
    __metadata("design:type", String)
], ComplianceItems.prototype, "expiry_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String], required: false }),
    __metadata("design:type", Array)
], ComplianceItems.prototype, "OCR_KEY", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof master_requirement_model_1.MasterRequirementModelDocument !== "undefined" && master_requirement_model_1.MasterRequirementModelDocument) === "function" ? _c : Object)
], ComplianceItems.prototype, "master_requirement", void 0);
ComplianceItems = __decorate([
    (0, mongoose_1.Schema)()
], ComplianceItems);
exports.ComplianceItems = ComplianceItems;
const ComplianceItemSchema = mongoose_1.SchemaFactory.createForClass(ComplianceItems);
let TemplateItems = class TemplateItems {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], TemplateItems.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], TemplateItems.prototype, "template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_f = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _f : Object)
], TemplateItems.prototype, "template_rule_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TemplateItems.prototype, "actual_limit", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TemplateItems.prototype, "status", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], TemplateItems.prototype, "show", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], TemplateItems.prototype, "waiver", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean }),
    __metadata("design:type", Boolean)
], TemplateItems.prototype, "post_closing", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TemplateItems.prototype, "document_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TemplateItems.prototype, "original_filename", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_g = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _g : Object)
], TemplateItems.prototype, "master_requirement_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TemplateItems.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Date, required: false }),
    __metadata("design:type", String)
], TemplateItems.prototype, "effective_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Date, required: false }),
    __metadata("design:type", String)
], TemplateItems.prototype, "expiry_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TemplateItems.prototype, "policy_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], TemplateItems.prototype, "named_insured", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String], required: false }),
    __metadata("design:type", Array)
], TemplateItems.prototype, "OCR_KEY", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_h = typeof master_requirement_model_1.MasterRequirementModelDocument !== "undefined" && master_requirement_model_1.MasterRequirementModelDocument) === "function" ? _h : Object)
], TemplateItems.prototype, "master_requirement", void 0);
TemplateItems = __decorate([
    (0, mongoose_1.Schema)()
], TemplateItems);
exports.TemplateItems = TemplateItems;
const TemplateItemSchema = mongoose_1.SchemaFactory.createForClass(TemplateItems);
let ComplianceModel = class ComplianceModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_j = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _j : Object)
], ComplianceModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_k = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _k : Object)
], ComplianceModel.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceModel.prototype, "vendor_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_l = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _l : Object)
], ComplianceModel.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceModel.prototype, "project_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_m = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _m : Object)
], ComplianceModel.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ComplianceModel.prototype, "client_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_o = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _o : Object)
], ComplianceModel.prototype, "requirement_group_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [ComplianceItemSchema], required: true }),
    __metadata("design:type", Array)
], ComplianceModel.prototype, "compliance_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [TemplateItemSchema], required: true }),
    __metadata("design:type", Array)
], ComplianceModel.prototype, "template_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_p = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _p : Object)
], ComplianceModel.prototype, "user_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_q = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _q : Object)
], ComplianceModel.prototype, "escalation_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], ComplianceModel.prototype, "in_escalation", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], ComplianceModel.prototype, "status", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_r = typeof Project_1.ProjectCompleteResponseDTO !== "undefined" && Project_1.ProjectCompleteResponseDTO) === "function" ? _r : Object)
], ComplianceModel.prototype, "project", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed, required: false }),
    __metadata("design:type", typeof (_s = typeof Record !== "undefined" && Record) === "function" ? _s : Object)
], ComplianceModel.prototype, "acord_28_ocr_data", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Mixed, required: false }),
    __metadata("design:type", typeof (_t = typeof Record !== "undefined" && Record) === "function" ? _t : Object)
], ComplianceModel.prototype, "acord_25_ocr_data", void 0);
ComplianceModel = __decorate([
    (0, mongoose_1.Schema)()
], ComplianceModel);
exports.ComplianceModel = ComplianceModel;
exports.ComplianceModelSchema = mongoose_1.SchemaFactory.createForClass(ComplianceModel);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoverageTypeManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const CoverageTypes_1 = __webpack_require__(64);
const CoverageTypesPartial_1 = __webpack_require__(65);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongoose_2 = __webpack_require__(28);
const coverage_type_model_1 = __webpack_require__(66);
let CoverageTypeManagerService = class CoverageTypeManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, CoverageTypeModel) {
        super(mapper);
        this.mapper = mapper;
        this.CoverageTypeModel = CoverageTypeModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, coverage_type_model_1.CoverageTypeModel, CoverageTypes_1.CoverageTypeCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, coverage_type_model_1.CoverageTypeModel, CoverageTypesPartial_1.CoverageTypePartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.CoverageTypeModel.create(createPayloadDto);
            return this.mapper.map(res, coverage_type_model_1.CoverageTypeModel, CoverageTypes_1.CoverageTypeCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.CoverageTypeModel.findById(id);
            return this.mapper.map(res, coverage_type_model_1.CoverageTypeModel, CoverageTypes_1.CoverageTypeCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.CoverageTypeModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.CoverageTypeModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, coverage_type_model_1.CoverageTypeModel, CoverageTypes_1.CoverageTypeCompleteResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.CoverageTypeModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
CoverageTypeManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(coverage_type_model_1.CoverageTypeModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], CoverageTypeManagerService);
exports.CoverageTypeManagerService = CoverageTypeManagerService;


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoverageTypeCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class CoverageTypeCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CoverageTypeCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CoverageTypeCompleteResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CoverageTypeCompleteResponseDto.prototype, "uuid", void 0);
exports.CoverageTypeCompleteResponseDto = CoverageTypeCompleteResponseDto;


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoverageTypePartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class CoverageTypePartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CoverageTypePartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CoverageTypePartialResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CoverageTypePartialResponseDto.prototype, "uuid", void 0);
exports.CoverageTypePartialResponseDto = CoverageTypePartialResponseDto;


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoverageTypeModelSchema = exports.CoverageTypeModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
let CoverageTypeModel = class CoverageTypeModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CoverageTypeModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    name: v,
                });
                return count === 0;
            },
            message: 'name must be unique',
        },
    }),
    __metadata("design:type", String)
], CoverageTypeModel.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    uuid: v,
                });
                return count === 0;
            },
            message: 'uuid must be unique',
        },
    }),
    __metadata("design:type", String)
], CoverageTypeModel.prototype, "uuid", void 0);
CoverageTypeModel = __decorate([
    (0, mongoose_1.Schema)()
], CoverageTypeModel);
exports.CoverageTypeModel = CoverageTypeModel;
exports.CoverageTypeModelSchema = mongoose_1.SchemaFactory.createForClass(CoverageTypeModel);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentCategoryManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const DocumentCategory_1 = __webpack_require__(68);
const DocumentCategoryPartial_1 = __webpack_require__(69);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongoose_2 = __webpack_require__(28);
const document_category_model_1 = __webpack_require__(70);
let DocumentCategoryManagerService = class DocumentCategoryManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, DocumentCategoryModel) {
        super(mapper);
        this.mapper = mapper;
        this.DocumentCategoryModel = DocumentCategoryModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, document_category_model_1.DocumentCategoryModel, DocumentCategory_1.DocumentCategoryCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, document_category_model_1.DocumentCategoryModel, DocumentCategoryPartial_1.DocumentCategoryPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.DocumentCategoryModel.create(createPayloadDto);
            return this.mapper.map(res, document_category_model_1.DocumentCategoryModel, DocumentCategory_1.DocumentCategoryCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.DocumentCategoryModel.findById(id);
            return this.mapper.map(res, document_category_model_1.DocumentCategoryModel, DocumentCategory_1.DocumentCategoryCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.DocumentCategoryModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.DocumentCategoryModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, document_category_model_1.DocumentCategoryModel, DocumentCategoryPartial_1.DocumentCategoryPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.DocumentCategoryModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
DocumentCategoryManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(document_category_model_1.DocumentCategoryModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], DocumentCategoryManagerService);
exports.DocumentCategoryManagerService = DocumentCategoryManagerService;


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentCategoryCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class DocumentCategoryCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentCategoryCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentCategoryCompleteResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentCategoryCompleteResponseDto.prototype, "uuid", void 0);
exports.DocumentCategoryCompleteResponseDto = DocumentCategoryCompleteResponseDto;


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentCategoryPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class DocumentCategoryPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentCategoryPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentCategoryPartialResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentCategoryPartialResponseDto.prototype, "uuid", void 0);
exports.DocumentCategoryPartialResponseDto = DocumentCategoryPartialResponseDto;


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentCategoryModelSchema = exports.DocumentCategoryModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
let DocumentCategoryModel = class DocumentCategoryModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentCategoryModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    uuid: v,
                });
                return count === 0;
            },
            message: 'uuid must be unique',
        },
    }),
    __metadata("design:type", String)
], DocumentCategoryModel.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    name: v,
                });
                return count === 0;
            },
            message: 'name must be unique',
        },
    }),
    __metadata("design:type", String)
], DocumentCategoryModel.prototype, "name", void 0);
DocumentCategoryModel = __decorate([
    (0, mongoose_1.Schema)()
], DocumentCategoryModel);
exports.DocumentCategoryModel = DocumentCategoryModel;
exports.DocumentCategoryModelSchema = mongoose_1.SchemaFactory.createForClass(DocumentCategoryModel);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentTypeManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const DocumentType_1 = __webpack_require__(72);
const DocumentTypePartial_1 = __webpack_require__(73);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongoose_2 = __webpack_require__(28);
const document_type_model_1 = __webpack_require__(74);
let DocumentTypeManagerService = class DocumentTypeManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, DocumentTypeModel) {
        super(mapper);
        this.mapper = mapper;
        this.DocumentTypeModel = DocumentTypeModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, document_type_model_1.DocumentTypeModel, DocumentType_1.DocumentTypeResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, document_type_model_1.DocumentTypeModel, DocumentTypePartial_1.DocumentTypePartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.DocumentTypeModel.create(createPayloadDto);
            return this.mapper.map(res, document_type_model_1.DocumentTypeModel, DocumentType_1.DocumentTypeResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.DocumentTypeModel.findById(id);
            return this.mapper.map(res, document_type_model_1.DocumentTypeModel, DocumentType_1.DocumentTypeResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getByUuid(uuid) {
        try {
            const res = await this.DocumentTypeModel.findOne({ uuid });
            return this.mapper.map(res, document_type_model_1.DocumentTypeModel, DocumentType_1.DocumentTypeResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.DocumentTypeModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.DocumentTypeModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, document_type_model_1.DocumentTypeModel, DocumentTypePartial_1.DocumentTypePartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.DocumentTypeModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
DocumentTypeManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(document_type_model_1.DocumentTypeModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], DocumentTypeManagerService);
exports.DocumentTypeManagerService = DocumentTypeManagerService;


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentTypeResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class DocumentTypeResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentTypeResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentTypeResponseDto.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentTypeResponseDto.prototype, "document_category_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentTypeResponseDto.prototype, "name", void 0);
exports.DocumentTypeResponseDto = DocumentTypeResponseDto;


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentTypePartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class DocumentTypePartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentTypePartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentTypePartialResponseDto.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentTypePartialResponseDto.prototype, "document_category_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentTypePartialResponseDto.prototype, "name", void 0);
exports.DocumentTypePartialResponseDto = DocumentTypePartialResponseDto;


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentTypeModelSchema = exports.DocumentTypeModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
let DocumentTypeModel = class DocumentTypeModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentTypeModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    uuid: v,
                });
                return count === 0;
            },
            message: 'uuid must be unique',
        },
    }),
    __metadata("design:type", String)
], DocumentTypeModel.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], DocumentTypeModel.prototype, "document_category_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    name: v,
                });
                return count === 0;
            },
            message: 'name must be unique',
        },
    }),
    __metadata("design:type", String)
], DocumentTypeModel.prototype, "name", void 0);
DocumentTypeModel = __decorate([
    (0, mongoose_1.Schema)()
], DocumentTypeModel);
exports.DocumentTypeModel = DocumentTypeModel;
exports.DocumentTypeModelSchema = mongoose_1.SchemaFactory.createForClass(DocumentTypeModel);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MasterRequirementManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const MasterRequirement_1 = __webpack_require__(76);
const MasterRequirementPartial_1 = __webpack_require__(77);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongoose_2 = __webpack_require__(28);
const master_requirement_model_1 = __webpack_require__(33);
let MasterRequirementManagerService = class MasterRequirementManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, MasterRequirementModel) {
        super(mapper);
        this.mapper = mapper;
        this.MasterRequirementModel = MasterRequirementModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, master_requirement_model_1.MasterRequirementModel, MasterRequirement_1.MasterRequirementCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, master_requirement_model_1.MasterRequirementModel, MasterRequirementPartial_1.MasterRequirementPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.MasterRequirementModel.create(createPayloadDto);
            return this.mapper.map(res, master_requirement_model_1.MasterRequirementModel, MasterRequirement_1.MasterRequirementCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['requirement_description', 'coverage_type_name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            queryConditions.$and = [
                { document_type_name: { $ne: 'Acord 25' } },
                { document_type_name: { $ne: 'Acord 28' } },
            ];
            const totalCount = await this.MasterRequirementModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.MasterRequirementModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit);
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, master_requirement_model_1.MasterRequirementModel, MasterRequirementPartial_1.MasterRequirementPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async find(filterQuery, query) {
        const queryConditions = {};
        let pagination = {
            page: 1,
            limit: 0,
        };
        if (!(0, lodash_1.isEmpty)(query)) {
            const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['requirement_description', 'coverage_type_name']);
            pagination = paginationData;
            queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
        }
        if (filterQuery.document_type_name) {
            filterQuery.document_type_name =
                filterQuery.document_type_name === 'acord25' ? 'Acord 25' : 'Acord 28';
        }
        queryConditions.$and = [filterQuery];
        const totalCount = await this.MasterRequirementModel.find(queryConditions).count();
        const skip = pagination.limit * (pagination.page - 1);
        const res = await this.MasterRequirementModel.find(queryConditions)
            .skip(skip)
            .limit(pagination.limit);
        const page = pagination.page;
        const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
        const data = this.mapper.mapArray(res, master_requirement_model_1.MasterRequirementModel, MasterRequirementPartial_1.MasterRequirementPartialResponseDto);
        return {
            page,
            perPage: perPage ? perPage : totalCount,
            total: totalCount,
            data,
        };
    }
    async getById(id) {
        try {
            const res = await this.MasterRequirementModel.findById(id);
            if (!res) {
                return null;
            }
            return this.mapper.map(res, master_requirement_model_1.MasterRequirementModel, MasterRequirementPartial_1.MasterRequirementPartialResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.MasterRequirementModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
MasterRequirementManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], MasterRequirementManagerService);
exports.MasterRequirementManagerService = MasterRequirementManagerService;


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MasterRequirementCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class MasterRequirementCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], MasterRequirementCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "coverage_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "coverage_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "document_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "requirement_description", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "requirement_rule", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "default_comment", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementCompleteResponseDto.prototype, "OCR", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], MasterRequirementCompleteResponseDto.prototype, "OCR_KEY", void 0);
exports.MasterRequirementCompleteResponseDto = MasterRequirementCompleteResponseDto;


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MasterRequirementPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class MasterRequirementPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], MasterRequirementPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "coverage_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "coverage_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "document_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "requirement_description", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "requirement_rule", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "default_comment", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], MasterRequirementPartialResponseDto.prototype, "order", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], MasterRequirementPartialResponseDto.prototype, "OCR", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], MasterRequirementPartialResponseDto.prototype, "OCR_KEY", void 0);
exports.MasterRequirementPartialResponseDto = MasterRequirementPartialResponseDto;


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequirementsService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(57);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(58);
const Requirements_1 = __webpack_require__(79);
const RequirementsPartial_1 = __webpack_require__(80);
const apiError_1 = __webpack_require__(31);
const enum_1 = __webpack_require__(60);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const compliance_model_1 = __webpack_require__(62);
const document_upload_model_1 = __webpack_require__(81);
const bullmq_2 = __webpack_require__(61);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const template_service_1 = __webpack_require__(83);
const requirements_model_1 = __webpack_require__(84);
const template_model_1 = __webpack_require__(34);
let RequirementsService = class RequirementsService extends nestjs_1.AutomapperProfile {
    constructor(mapper, RequirementsModel, TemplateModel, DocumentUploadModel, ComplianceModel, TemplateService, templateUpdateQueue, RequirementRuleUpdateQueue, RequirementTempUpdateQueue) {
        super(mapper);
        this.mapper = mapper;
        this.RequirementsModel = RequirementsModel;
        this.TemplateModel = TemplateModel;
        this.DocumentUploadModel = DocumentUploadModel;
        this.ComplianceModel = ComplianceModel;
        this.TemplateService = TemplateService;
        this.templateUpdateQueue = templateUpdateQueue;
        this.RequirementRuleUpdateQueue = RequirementRuleUpdateQueue;
        this.RequirementTempUpdateQueue = RequirementTempUpdateQueue;
        this.logger = new common_1.Logger();
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, requirements_model_1.RequirementsModel, Requirements_1.RequirementsCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.requirement_items, (0, core_1.mapFrom)(s => s.requirement_items)));
            (0, core_1.createMap)(mapper, requirements_model_1.RequirementsModel, RequirementsPartial_1.RequirementsPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.requirement_items, (0, core_1.mapFrom)(s => s.requirement_items)));
            (0, core_1.createMap)(mapper, Requirements_1.RequirementsCompletePopulatedResponseDto, Requirements_1.RequirementsCompletePopulatedResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.requirement_items, (0, core_1.mapFrom)(s => s.requirement_items)), (0, core_1.forMember)(d => d.name, (0, core_1.mapFrom)(s => s.name)), (0, core_1.forMember)(d => d.acord28template_id, (0, core_1.mapFrom)(s => s.acord28template_id)), (0, core_1.forMember)(d => d.acord25template_id, (0, core_1.mapFrom)(s => s.acord25template_id)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.RequirementsModel.create(createPayloadDto);
            return this.mapper.map(res, requirements_model_1.RequirementsModel, Requirements_1.RequirementsCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.RequirementsModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.RequirementsModel.aggregate([
                { $match: queryConditions },
                {
                    $sort: { _id: -1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: pagination.limit == 0
                        ? totalCount === 0
                            ? 10
                            : totalCount
                        : pagination.limit,
                },
                {
                    $lookup: {
                        from: 'projectmodels',
                        localField: '_id',
                        foreignField: 'assigned_vendor.requirement_group_id',
                        as: 'project',
                    },
                },
            ]);
            for (const requirement of res) {
                const assignedVendors = requirement.project.flatMap((project) => project.assigned_vendor);
                const totalAssignments = assignedVendors.reduce((count, vendor) => {
                    if (vendor.requirement_group_id.toString() ===
                        requirement._id.toString()) {
                        return count + 1;
                    }
                    else {
                        return count;
                    }
                }, 0);
                requirement.total_assignments = totalAssignments;
            }
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, requirements_model_1.RequirementsModel, RequirementsPartial_1.RequirementsPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateRequirements(id, updateRequirmentPayload) {
        var _a, _b, _c, _d;
        try {
            const requirement = await this.RequirementsModel.findById(id);
            if (!requirement) {
                return null;
            }
            let requirement_items_ids = requirement.requirement_items;
            if (updateRequirmentPayload.id) {
                const exist = (0, lodash_1.includes)(requirement.requirement_items.map(item => item.toString()), updateRequirmentPayload.id.toString());
                if (exist) {
                    requirement_items_ids = (0, lodash_1.pull)(requirement.requirement_items.map(item => item.toString()), updateRequirmentPayload.id.toString()).map(item => new mongodb_1.ObjectId(item));
                    const queueDateForCompliacne = {
                        action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
                        master_requirement_id: updateRequirmentPayload.id,
                        requirement_group_id: new mongodb_1.ObjectId(id),
                    };
                    this.RequirementRuleUpdateQueue.add(constants_1.COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE, queueDateForCompliacne);
                    const notifications = await this.DocumentUploadModel.find({
                        masterReqId: updateRequirmentPayload.id,
                    });
                    if (notifications && notifications.length > 0) {
                        for (const notification of notifications) {
                            const compliance = await this.ComplianceModel.findById({
                                _id: notification === null || notification === void 0 ? void 0 : notification.compliance_id,
                            });
                            const ComplianceItemWithSameDocType = compliance === null || compliance === void 0 ? void 0 : compliance.compliance_items.filter(el => {
                                var _a;
                                return el.document_type_uuid === notification.document_type_uuid &&
                                    el.master_requirement_id.toString() !==
                                        ((_a = notification.masterReqId) === null || _a === void 0 ? void 0 : _a.toString());
                            });
                            if (ComplianceItemWithSameDocType &&
                                ComplianceItemWithSameDocType.length > 0) {
                                await this.DocumentUploadModel.findByIdAndUpdate(notification._id, {
                                    $set: {
                                        item_id: ComplianceItemWithSameDocType[0]._id,
                                        masterReqId: ComplianceItemWithSameDocType[0].master_requirement_id,
                                    },
                                }, { new: true });
                            }
                            else {
                                await this.DocumentUploadModel.findByIdAndUpdate(notification._id, {
                                    $set: {
                                        isDeleted: true,
                                    },
                                }, {
                                    new: true,
                                });
                            }
                        }
                    }
                }
                else {
                    requirement_items_ids = requirement.requirement_items.concat([
                        updateRequirmentPayload.id,
                    ]);
                    const queueDateForCompliacne = {
                        action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.ADDED,
                        master_requirement_id: updateRequirmentPayload.id,
                        requirement_group_id: new mongodb_1.ObjectId(id),
                    };
                    this.RequirementRuleUpdateQueue.add(constants_1.COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE, queueDateForCompliacne);
                }
            }
            if (updateRequirmentPayload.acord25template_id) {
                const check = await this.TemplateModel.findById(updateRequirmentPayload.acord25template_id);
                const enabled_rule = check === null || check === void 0 ? void 0 : check.rules.filter(el => el.is_enabled);
                if (enabled_rule && enabled_rule.length < 1) {
                    throw new apiError_1.ServiceError('Selected template does not have any active rule!', common_1.HttpStatus.BAD_REQUEST);
                }
                const reqTempChangeQueueData = {
                    requirement_group_id: new mongodb_1.ObjectId(id),
                    old_template_id: requirement.acord25template_id,
                    new_template_id: updateRequirmentPayload.acord25template_id,
                };
                if (((_a = updateRequirmentPayload.acord25template_id) === null || _a === void 0 ? void 0 : _a.toString()) !=
                    ((_b = requirement.acord25template_id) === null || _b === void 0 ? void 0 : _b.toString())) {
                    this.RequirementTempUpdateQueue.add(constants_1.COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE, reqTempChangeQueueData);
                }
            }
            if (updateRequirmentPayload.acord28template_id) {
                const check = await this.TemplateModel.findById(updateRequirmentPayload.acord28template_id);
                const enabled_rule = check === null || check === void 0 ? void 0 : check.rules.filter(el => el.is_enabled);
                if (enabled_rule && enabled_rule.length < 1) {
                    throw new apiError_1.ServiceError('Selected template does not have any active rule!', common_1.HttpStatus.BAD_REQUEST);
                }
                const reqTempChangeQueueData = {
                    requirement_group_id: new mongodb_1.ObjectId(id),
                    old_template_id: requirement.acord28template_id,
                    new_template_id: updateRequirmentPayload.acord28template_id,
                };
                if (((_c = updateRequirmentPayload.acord28template_id) === null || _c === void 0 ? void 0 : _c.toString()) !=
                    ((_d = requirement.acord28template_id) === null || _d === void 0 ? void 0 : _d.toString())) {
                    this.RequirementTempUpdateQueue.add(constants_1.COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE, reqTempChangeQueueData);
                }
            }
            const res = await this.RequirementsModel.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, Object.assign(Object.assign(Object.assign(Object.assign({}, (updateRequirmentPayload.name && {
                name: updateRequirmentPayload.name,
            })), (updateRequirmentPayload.acord25template_id && {
                acord25template_id: updateRequirmentPayload.acord25template_id,
            })), (updateRequirmentPayload.acord28template_id && {
                acord28template_id: updateRequirmentPayload.acord28template_id,
            })), { requirement_items: requirement_items_ids }), { new: true, overwrite: false });
            return this.mapper.map(res, requirements_model_1.RequirementsModel, Requirements_1.RequirementsCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = (await this.RequirementsModel.aggregate([
                { $match: { _id: new mongoose_2.default.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        let: { requirement_items: '$requirement_items' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', '$$requirement_items'],
                                    },
                                },
                            },
                        ],
                        as: 'requirement_items',
                    },
                },
                {
                    $limit: 1,
                },
            ]));
            return this.mapper.map(res[0], Requirements_1.RequirementsCompletePopulatedResponseDto, Requirements_1.RequirementsCompletePopulatedResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async createCopy(createPayloadDto) {
        try {
            const existingRequirements = await this.RequirementsModel.findById(createPayloadDto.id);
            if (!existingRequirements) {
                throw new apiError_1.ServiceError("Requirement Group with that particular id doesn't exist!", common_1.HttpStatus.BAD_REQUEST);
            }
            const payload = {
                name: createPayloadDto.name,
                requirement_items: existingRequirements.requirement_items,
            };
            if (existingRequirements.acord28template_id) {
                payload.acord28template_id = existingRequirements.acord28template_id;
            }
            if (existingRequirements.acord25template_id) {
                payload.acord25template_id = existingRequirements.acord25template_id;
            }
            const res = await this.RequirementsModel.create(payload);
            return this.mapper.map(res, requirements_model_1.RequirementsModel, Requirements_1.RequirementsCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async removeTemplate(id, updateRequirements) {
        var _a;
        try {
            const queryCondition = { $and: [] };
            const updatePayload = {
                $unset: {},
            };
            const template = await this.TemplateService.getById((_a = updateRequirements.acord25template_id) !== null && _a !== void 0 ? _a : updateRequirements.acord28template_id);
            const activeRules = template.rules
                .filter(el => el.is_enabled)
                .map(el => el._id.toString());
            if (activeRules.length > 0) {
                const rulesToBeRemoved = {
                    template_id: template._id.toString(),
                    rules_id: activeRules,
                    action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
                };
                await this.templateUpdateQueue.add(constants_1.TEMPLATE_UPDATE_QUEUE, rulesToBeRemoved);
            }
            queryCondition.$and.push({ _id: id });
            if (updateRequirements.acord25template_id) {
                queryCondition.$and.push({
                    acord25template_id: updateRequirements.acord25template_id,
                });
                updatePayload.$unset['acord25template_id'] = '';
            }
            if (updateRequirements.acord28template_id) {
                queryCondition.$and.push({
                    acord28template_id: updateRequirements.acord28template_id,
                });
                updatePayload.$unset['acord28template_id'] = '';
            }
            const res = await this.RequirementsModel.findOneAndUpdate(queryCondition, updatePayload, { new: true });
            return this.mapper.map(res, requirements_model_1.RequirementsModel, Requirements_1.RequirementsCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.RequirementsModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
RequirementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(requirements_model_1.RequirementsModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(document_upload_model_1.DocumentUploadModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(6, (0, bullmq_1.InjectQueue)(constants_1.TEMPLATE_UPDATE_QUEUE)),
    __param(7, (0, bullmq_1.InjectQueue)(constants_1.COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE)),
    __param(8, (0, bullmq_1.InjectQueue)(constants_1.COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof template_service_1.ITemplateService !== "undefined" && template_service_1.ITemplateService) === "function" ? _f : Object, typeof (_g = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _g : Object, typeof (_h = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _h : Object, typeof (_j = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _j : Object])
], RequirementsService);
exports.RequirementsService = RequirementsService;


/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequirementsCompletePopulatedResponseDto = exports.RequirementsCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const swagger_1 = __webpack_require__(3);
const mongodb_1 = __webpack_require__(25);
class RequirementsCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], RequirementsCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], RequirementsCompleteResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], RequirementsCompleteResponseDto.prototype, "requirement_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], RequirementsCompleteResponseDto.prototype, "acord25template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], RequirementsCompleteResponseDto.prototype, "acord28template_id", void 0);
exports.RequirementsCompleteResponseDto = RequirementsCompleteResponseDto;
class RequirementsCompletePopulatedResponseDto extends (0, swagger_1.OmitType)(RequirementsCompleteResponseDto, ['requirement_items']) {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], RequirementsCompletePopulatedResponseDto.prototype, "requirement_items", void 0);
exports.RequirementsCompletePopulatedResponseDto = RequirementsCompletePopulatedResponseDto;


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequirementsPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class RequirementsPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], RequirementsPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], RequirementsPartialResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], RequirementsPartialResponseDto.prototype, "requirement_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], RequirementsPartialResponseDto.prototype, "acord25template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], RequirementsPartialResponseDto.prototype, "acord28template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], RequirementsPartialResponseDto.prototype, "total_assignments", void 0);
exports.RequirementsPartialResponseDto = RequirementsPartialResponseDto;


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentUploadModelSchema = exports.DocumentUploadModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const vendor_model_1 = __webpack_require__(82);
let DocumentUploadModel = class DocumentUploadModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentUploadModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongodb_1.ObjectId, required: true }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], DocumentUploadModel.prototype, "compliance_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "item_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongodb_1.ObjectId, required: true }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], DocumentUploadModel.prototype, "item_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongodb_1.ObjectId, required: true }),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], DocumentUploadModel.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], DocumentUploadModel.prototype, "is_read", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "original_filename", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "document_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "company_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.default.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], DocumentUploadModel.prototype, "masterReqId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.default.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_f = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _f : Object)
], DocumentUploadModel.prototype, "templateRuleId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], DocumentUploadModel.prototype, "isDeleted", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "document_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "project_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "address", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], DocumentUploadModel.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_g = typeof vendor_model_1.VendorModel !== "undefined" && vendor_model_1.VendorModel) === "function" ? _g : Object)
], DocumentUploadModel.prototype, "vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], DocumentUploadModel.prototype, "effective_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_j = typeof Date !== "undefined" && Date) === "function" ? _j : Object)
], DocumentUploadModel.prototype, "expiry_date", void 0);
DocumentUploadModel = __decorate([
    (0, mongoose_1.Schema)()
], DocumentUploadModel);
exports.DocumentUploadModel = DocumentUploadModel;
exports.DocumentUploadModelSchema = mongoose_1.SchemaFactory.createForClass(DocumentUploadModel);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VendorModelSchema = exports.VendorModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let VendorModel = class VendorModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], VendorModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    username: v,
                });
                return count === 0;
            },
            message: 'username must be unique',
        },
    }),
    __metadata("design:type", String)
], VendorModel.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], VendorModel.prototype, "contacts_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    email: v,
                });
                return count === 0;
            },
            message: 'email must be unique',
        },
    }),
    __metadata("design:type", String)
], VendorModel.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId], default: [] }),
    __metadata("design:type", Array)
], VendorModel.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    vendor_name: v,
                });
                return count === 0;
            },
            message: 'vendor name must be unique',
        },
    }),
    __metadata("design:type", String)
], VendorModel.prototype, "vendor_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    alias: v,
                });
                return count === 0;
            },
            message: 'alias must be unique',
        },
    }),
    __metadata("design:type", String)
], VendorModel.prototype, "alias", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    phone_number: v,
                });
                return count === 0;
            },
            message: 'phone number must be unique',
        },
    }),
    __metadata("design:type", String)
], VendorModel.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "scope_of_work", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], VendorModel.prototype, "title", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], VendorModel.prototype, "direct_dial", void 0);
VendorModel = __decorate([
    (0, mongoose_1.Schema)()
], VendorModel);
exports.VendorModel = VendorModel;
exports.VendorModelSchema = mongoose_1.SchemaFactory.createForClass(VendorModel);


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITemplateService = void 0;
class ITemplateService {
}
exports.ITemplateService = ITemplateService;


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RequirementsModelSchema = exports.RequirementsModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let RequirementsModel = class RequirementsModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], RequirementsModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    name: v,
                });
                return count === 0;
            },
            message: 'name must be unique',
        },
    }),
    __metadata("design:type", String)
], RequirementsModel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], RequirementsModel.prototype, "requirement_items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], RequirementsModel.prototype, "acord25template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], RequirementsModel.prototype, "acord28template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], RequirementsModel.prototype, "total_assignments", void 0);
RequirementsModel = __decorate([
    (0, mongoose_1.Schema)()
], RequirementsModel);
exports.RequirementsModel = RequirementsModel;
exports.RequirementsModelSchema = mongoose_1.SchemaFactory.createForClass(RequirementsModel);


/***/ }),
/* 85 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(57);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(58);
const Template_1 = __webpack_require__(86);
const apiError_1 = __webpack_require__(31);
const enum_1 = __webpack_require__(60);
const errorHandler_1 = __webpack_require__(32);
const compliance_model_1 = __webpack_require__(62);
const document_upload_model_1 = __webpack_require__(81);
const bullmq_2 = __webpack_require__(61);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const master_requirement_service_1 = __webpack_require__(87);
const template_model_1 = __webpack_require__(34);
let TemplateManagerService = class TemplateManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, TemplateModel, DocumentUploadModel, ComplianceModel, templateUpdateQueue, masterRequirement) {
        super(mapper);
        this.mapper = mapper;
        this.TemplateModel = TemplateModel;
        this.DocumentUploadModel = DocumentUploadModel;
        this.ComplianceModel = ComplianceModel;
        this.templateUpdateQueue = templateUpdateQueue;
        this.masterRequirement = masterRequirement;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto, (0, core_1.forMember)(d => d.rules, (0, core_1.mapFrom)(s => s.rules)), (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, template_model_1.RuleEntity, template_model_1.RuleEntity);
        };
    }
    async create(templateCreator) {
        const data = await this.TemplateModel.findOne({
            template_name: templateCreator.template_name,
            active: true,
        });
        if (data) {
            throw new apiError_1.ServiceError('Template name already exist', common_1.HttpStatus.OK);
        }
        const res = await this.TemplateModel.create(templateCreator);
        return this.mapper.map(res, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
    }
    async find(filterQuery) {
        if (filterQuery.type) {
            filterQuery.type =
                filterQuery.type === enum_1.TEMPLATE_TYPE_QUERY_ENUM.ACCORD_25
                    ? 'Acord 25'
                    : 'Acord 28';
        }
        const res = await this.TemplateModel.find(Object.assign(Object.assign({}, filterQuery), { active: true })).sort({ _id: -1 });
        return this.mapper.mapArray(res, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
    }
    async getById(id) {
        try {
            const res = await this.TemplateModel.aggregate([
                { $match: { _id: new mongoose_2.default.Types.ObjectId(id), active: true } },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        let: { letId: '$rules.master_requirement_id' },
                        pipeline: [
                            { $match: { $expr: { $in: ['$_id', '$$letId'] } } },
                            {
                                $project: {
                                    coverage_type_name: 1,
                                    document_type_name: 1,
                                    default_comment: 1,
                                    requirement_rule: 1,
                                },
                            },
                        ],
                        as: 'lookupRelations',
                    },
                },
                {
                    $addFields: {
                        rules: {
                            $map: {
                                input: '$rules',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            coverage_type_name: {
                                                $arrayElemAt: [
                                                    '$lookupRelations.coverage_type_name',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations._id',
                                                            '$$rel._id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            document_type_name: {
                                                $arrayElemAt: [
                                                    '$lookupRelations.document_type_name',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations._id',
                                                            '$$rel._id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            requirement_rule: {
                                                $arrayElemAt: [
                                                    '$lookupRelations.requirement_rule',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations._id',
                                                            '$$rel._id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            default_comment: {
                                                $arrayElemAt: [
                                                    '$lookupRelations.default_comment',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations._id',
                                                            '$$rel._id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        lookupRelations: 0,
                    },
                },
            ]);
            if (res.length < 1) {
                throw new apiError_1.ServiceError(`template id doesn't exist`, common_1.HttpStatus.BAD_REQUEST);
            }
            return this.mapper.map(res[0], template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getRuleById(id, master_requirement_id) {
        try {
            let res = await this.TemplateModel.findOne({
                _id: new mongodb_1.ObjectId(id),
                'rules.master_requirement_id': new mongodb_1.ObjectId(master_requirement_id),
            });
            if (!res) {
                const template = await this.TemplateModel.findById(id);
                if (!template) {
                    throw new apiError_1.ServiceError(`template id doesn't exist`, common_1.HttpStatus.BAD_REQUEST);
                }
                const masterRequirement = await this.masterRequirement.getById(master_requirement_id);
                if (!masterRequirement) {
                    throw new apiError_1.ServiceError(`Master Requirement id doesn't exist`, common_1.HttpStatus.BAD_REQUEST);
                }
                const newRule = {
                    condition: 'Required',
                    is_enabled: false,
                    name: '',
                    master_requirement_id: masterRequirement._id,
                    value: masterRequirement.requirement_rule,
                    message: masterRequirement.default_comment,
                };
                await this.update(id, {
                    rules: [...template.rules, newRule],
                });
                res = await this.TemplateModel.findOne({
                    _id: new mongodb_1.ObjectId(id),
                    'rules.master_requirement_id': new mongodb_1.ObjectId(master_requirement_id),
                });
            }
            if (!res) {
                throw new apiError_1.ServiceError(`master_requirement_id doesn't exist`, common_1.HttpStatus.BAD_REQUEST);
            }
            const rule = res.rules.filter(rule => rule.master_requirement_id.toString() === master_requirement_id);
            return this.mapper.map(rule[0], template_model_1.RuleEntity, template_model_1.RuleEntity);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, templateUpdate) {
        var _a;
        try {
            const template = await this.TemplateModel.findOne({ _id: id });
            if (!template) {
                throw new apiError_1.ServiceError(`Template with 'id' ${id} doesn't exist`, common_1.HttpStatus.BAD_REQUEST);
            }
            const rules_to_update = [];
            const rules_to_remove = [];
            const rulesToBeAddedInCompliance = [];
            const rulesToBeRemovedInCompliance = [];
            (_a = template.rules) === null || _a === void 0 ? void 0 : _a.forEach(oldRule => {
                let match = false;
                templateUpdate.rules.forEach((newRule, index) => {
                    if (oldRule.master_requirement_id.toString() ===
                        newRule.master_requirement_id.toString()) {
                        rules_to_update.push(Object.assign(Object.assign({}, newRule), { _id: oldRule._id }));
                        if (newRule.hasOwnProperty('is_enabled')) {
                            if (oldRule.is_enabled && !newRule.is_enabled) {
                                rulesToBeRemovedInCompliance.push(oldRule._id.toString());
                            }
                            if (!oldRule.is_enabled && newRule.is_enabled) {
                                rulesToBeAddedInCompliance.push(oldRule._id.toString());
                            }
                        }
                        templateUpdate.rules.splice(index, 1);
                        match = true;
                    }
                });
                if (!match) {
                    rules_to_remove.push(oldRule._id);
                    if (oldRule.is_enabled) {
                        rulesToBeRemovedInCompliance.push(oldRule._id.toString());
                    }
                }
            });
            await this.TemplateModel.updateOne({ _id: id }, { $pull: { rules: { _id: { $in: rules_to_remove } } } }, { new: true });
            const setOperator = {};
            const arrayFilters = [];
            rules_to_update.forEach((data, index) => {
                const elementKey = `element${index}`;
                setOperator[`rules.$[${elementKey}].name`] = data.name;
                setOperator[`rules.$[${elementKey}].condition`] = data.condition;
                setOperator[`rules.$[${elementKey}].value`] = data.value || '';
                setOperator[`rules.$[${elementKey}].message`] = data.message;
                if (data.hasOwnProperty('is_enabled')) {
                    setOperator[`rules.$[${elementKey}].is_enabled`] = data.is_enabled;
                }
                arrayFilters.push({
                    [`${elementKey}.master_requirement_id`]: data.master_requirement_id,
                });
            });
            await this.TemplateModel.updateOne({ _id: id }, { $set: setOperator }, { arrayFilters });
            const res = await this.TemplateModel.findByIdAndUpdate({ _id: id }, { $push: { rules: { $each: templateUpdate.rules } } }, { new: true });
            if (rulesToBeRemovedInCompliance.length > 0) {
                const rulesToBeRemoved = {
                    template_id: id,
                    rules_id: rulesToBeRemovedInCompliance,
                    action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
                };
                await this.templateUpdateQueue.add(constants_1.TEMPLATE_UPDATE_QUEUE, rulesToBeRemoved);
            }
            if (res === null || res === void 0 ? void 0 : res.rules) {
                res.rules.forEach(existingRule => {
                    templateUpdate.rules.forEach(newlyAddedRule => {
                        if (existingRule.master_requirement_id.toString() ===
                            newlyAddedRule.master_requirement_id.toString() &&
                            existingRule.is_enabled) {
                            rulesToBeAddedInCompliance.push(existingRule._id.toString());
                        }
                    });
                });
                if (rulesToBeAddedInCompliance.length > 0) {
                    const rulesToBeAdded = {
                        template_id: id,
                        rules_id: rulesToBeAddedInCompliance,
                        action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.ADDED,
                    };
                    this.templateUpdateQueue.add(constants_1.TEMPLATE_UPDATE_QUEUE, rulesToBeAdded);
                }
            }
            return this.mapper.map(res, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
        }
        catch (e) {
            throw (0, errorHandler_1.errorHandler)(e);
        }
    }
    async updateRuleById(id, master_requirement_id, templateUpdate) {
        try {
            const temp = await this.TemplateModel.findById(id);
            if (!temp) {
                throw new apiError_1.ServiceError("Template doesn't exist!", common_1.HttpStatus.NOT_FOUND);
            }
            const oldRule = temp.rules.find(rule => rule.master_requirement_id.toString() === master_requirement_id);
            const dataToUpdate = Object.assign(Object.assign({}, templateUpdate), { is_enabled: oldRule === null || oldRule === void 0 ? void 0 : oldRule.is_enabled, _id: oldRule === null || oldRule === void 0 ? void 0 : oldRule._id });
            const template = await this.TemplateModel.findOneAndUpdate({
                _id: id,
                'rules.master_requirement_id': new mongodb_1.ObjectId(master_requirement_id),
            }, {
                $set: {
                    'rules.$': dataToUpdate,
                },
            }, { new: true });
            return this.mapper.map(template, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
        }
        catch (e) {
            throw (0, errorHandler_1.errorHandler)(e);
        }
    }
    async deleteOne(id) {
        try {
            const res = await this.TemplateModel.findOneAndUpdate({
                _id: id,
                active: true,
            }, {
                active: false,
            }, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError('Template not found', common_1.HttpStatus.BAD_REQUEST);
            }
            return {
                message: 'Template Item Deleted Successfully',
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.TemplateModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async createCopy(createPayloadDto) {
        try {
            const existingTemplate = await this.TemplateModel.findById(createPayloadDto.id);
            if (!existingTemplate) {
                throw new apiError_1.ServiceError("Template with that particular id doesn't exist!", common_1.HttpStatus.BAD_REQUEST);
            }
            const payload = {
                template_name: createPayloadDto.name,
                rules: existingTemplate.rules,
                type: existingTemplate.type,
            };
            const res = await this.TemplateModel.create(payload);
            return this.mapper.map(res, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async toggleRuleStatus(id, master_requirement_id) {
        try {
            const res = (await this.getRuleById(id, master_requirement_id));
            if ((0, lodash_1.isEmpty)(res)) {
                throw new apiError_1.ServiceError('Rule not found', common_1.HttpStatus.BAD_REQUEST);
            }
            const check = await this.TemplateModel.findById(id);
            const enabled_rule = check === null || check === void 0 ? void 0 : check.rules.filter(el => el.is_enabled);
            if (enabled_rule && enabled_rule.length < 2 && res.is_enabled) {
                throw new apiError_1.ServiceError('Template must have one active rule!', common_1.HttpStatus.BAD_REQUEST);
            }
            const template = await this.TemplateModel.findOneAndUpdate({
                _id: id,
                'rules.master_requirement_id': new mongodb_1.ObjectId(master_requirement_id),
            }, {
                $set: {
                    'rules.$.is_enabled': !res.is_enabled,
                },
            }, { new: true });
            if (template) {
                const rule = template.rules.find(el => el.master_requirement_id.toString() ===
                    master_requirement_id.toString());
                if (rule) {
                    if (rule.is_enabled) {
                        const rulesToBeRemoved = {
                            template_id: id,
                            rules_id: [rule._id.toString()],
                            action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.ADDED,
                        };
                        await this.templateUpdateQueue.add(constants_1.TEMPLATE_UPDATE_QUEUE, rulesToBeRemoved);
                    }
                    else {
                        const notifications = await this.DocumentUploadModel.find({
                            templateRuleId: rule._id,
                        });
                        if (notifications && notifications.length > 0) {
                            for (const notification of notifications) {
                                const compliance = await this.ComplianceModel.findById({
                                    _id: notification === null || notification === void 0 ? void 0 : notification.compliance_id,
                                });
                                const ruleWithSameDocType = compliance === null || compliance === void 0 ? void 0 : compliance.template_items.filter(el => {
                                    var _a;
                                    return el.document_type_uuid === notification.document_type_uuid &&
                                        el.template_rule_id.toString() !==
                                            ((_a = notification.templateRuleId) === null || _a === void 0 ? void 0 : _a.toString());
                                });
                                if (ruleWithSameDocType && ruleWithSameDocType.length > 0) {
                                    await this.DocumentUploadModel.findByIdAndUpdate(notification._id, {
                                        $set: {
                                            item_id: ruleWithSameDocType[0]._id,
                                            templateRuleId: ruleWithSameDocType[0].template_rule_id,
                                        },
                                    }, { new: true });
                                }
                                else {
                                    await this.DocumentUploadModel.findByIdAndUpdate(notification._id, {
                                        $set: {
                                            isDeleted: true,
                                        },
                                    }, {
                                        new: true,
                                    });
                                }
                            }
                        }
                        const rulesToBeRemoved = {
                            template_id: id,
                            rules_id: [rule._id.toString()],
                            action: enum_1.COMPLIANCE_UPDATE_TEMPLATES.REMOVED,
                        };
                        await this.templateUpdateQueue.add(constants_1.TEMPLATE_UPDATE_QUEUE, rulesToBeRemoved);
                    }
                }
            }
            if (template) {
                return this.mapper.map(template, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
            }
            return this.mapper.map(template, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async templateNameEdit(id, name) {
        try {
            const template = await this.TemplateModel.findByIdAndUpdate(id, {
                $set: {
                    template_name: name.template_name,
                },
            }, { new: true });
            if (template) {
                return this.mapper.map(template, template_model_1.TemplateModel, Template_1.TemplateCompleteResponseDto);
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
TemplateManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(document_upload_model_1.DocumentUploadModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, bullmq_1.InjectQueue)(constants_1.TEMPLATE_UPDATE_QUEUE)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _e : Object, typeof (_f = typeof master_requirement_service_1.IMasterRequirementService !== "undefined" && master_requirement_service_1.IMasterRequirementService) === "function" ? _f : Object])
], TemplateManagerService);
exports.TemplateManagerService = TemplateManagerService;


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const template_model_1 = __webpack_require__(34);
const mongodb_1 = __webpack_require__(25);
class TemplateCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], TemplateCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], TemplateCompleteResponseDto.prototype, "template_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => template_model_1.RuleEntity),
    __metadata("design:type", Array)
], TemplateCompleteResponseDto.prototype, "rules", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], TemplateCompleteResponseDto.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], TemplateCompleteResponseDto.prototype, "type", void 0);
exports.TemplateCompleteResponseDto = TemplateCompleteResponseDto;


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IMasterRequirementService = void 0;
class IMasterRequirementService {
}
exports.IMasterRequirementService = IMasterRequirementService;


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadManagerService = void 0;
const common_1 = __webpack_require__(1);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const uploadHelpers_1 = __webpack_require__(89);
const path_1 = __webpack_require__(92);
const INVALID_FILENAME = 'Invalid Filename';
const NOT_FOUND = 'File Not Found';
let UploadManagerService = class UploadManagerService {
    async savedFilePath(file) {
        return {
            filename: file.originalname,
            key: file.filename,
        };
    }
    async getFile(fileName, res) {
        try {
            const isValidFilename = (0, uploadHelpers_1.isFilenameFormatUUIDv4)(fileName);
            if (!isValidFilename) {
                throw new apiError_1.ServiceError(INVALID_FILENAME, common_1.HttpStatus.BAD_REQUEST);
            }
            const filePath = `uploads/${fileName}`;
            const fileAvailable = (0, uploadHelpers_1.fileExists)(filePath);
            if (!fileAvailable) {
                throw new apiError_1.ServiceError(NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            res.sendFile((0, path_1.resolve)(filePath));
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
UploadManagerService = __decorate([
    (0, common_1.Injectable)()
], UploadManagerService);
exports.UploadManagerService = UploadManagerService;


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isFilenameFormatUUIDv4 = exports.fileExists = exports.storage = void 0;
const fs_1 = __webpack_require__(90);
const multer_1 = __webpack_require__(91);
const path_1 = __webpack_require__(92);
const uuid_1 = __webpack_require__(93);
exports.storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        try {
            (0, fs_1.mkdirSync)(uploadPath, { recursive: true });
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                return cb(err, uploadPath);
            }
            return cb(err, uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = (0, path_1.extname)(file.originalname);
        cb(null, `${(0, uuid_1.v4)() + ext}`);
    },
});
function fileExists(path) {
    return (0, fs_1.existsSync)(path);
}
exports.fileExists = fileExists;
function isFilenameFormatUUIDv4(name) {
    const pattern = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+.[a-zA-Z]+$/;
    return pattern.test(name);
}
exports.isFilenameFormatUUIDv4 = isFilenameFormatUUIDv4;


/***/ }),
/* 90 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 91 */
/***/ ((module) => {

module.exports = require("multer");

/***/ }),
/* 92 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 93 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const User_1 = __webpack_require__(95);
const UserPartial_1 = __webpack_require__(96);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const bcryptjs_1 = __webpack_require__(97);
const bcrypt = __webpack_require__(97);
const lodash_1 = __webpack_require__(41);
const mongoose_2 = __webpack_require__(28);
const user_model_1 = __webpack_require__(98);
let UserManagerService = class UserManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, UserModel) {
        super(mapper);
        this.mapper = mapper;
        this.UserModel = UserModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, user_model_1.UserModel, User_1.UserCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, user_model_1.UserModel, UserPartial_1.UserPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)));
            (0, core_1.createMap)(mapper, user_model_1.UserModel, User_1.UserCompleteResponsewithPasswordDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.password, (0, core_1.mapFrom)(s => s.password)));
        };
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['first_name', 'last_name', 'username']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.UserModel.find(Object.assign(Object.assign({}, queryConditions), { is_deleted: false })).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.UserModel.find(Object.assign(Object.assign({}, queryConditions), { is_deleted: false }))
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, user_model_1.UserModel, UserPartial_1.UserPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async create(alsUserPayload) {
        try {
            const hashPassword = await (0, bcryptjs_1.hash)(alsUserPayload.password, 10);
            alsUserPayload.password = hashPassword;
            const res = await this.UserModel.create(alsUserPayload);
            return this.mapper.map(res, user_model_1.UserModel, User_1.UserCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.UserModel.findOne({
                _id: id,
                is_deleted: false,
            });
            return this.mapper.map(res, user_model_1.UserModel, User_1.UserCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.UserModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, user_model_1.UserModel, User_1.UserCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updatePassword(id, updatePayloadDto) {
        try {
            const user = await this.userWithPassword({
                _id: id,
            });
            if (user &&
                (await bcrypt.compare(updatePayloadDto.password, user.password))) {
                const newhashPassword = await (0, bcryptjs_1.hash)(updatePayloadDto.newPassword, 10);
                await this.UserModel.findOneAndUpdate({
                    _id: id,
                }, { password: newhashPassword }, { new: true, overwrite: false });
                return { message: 'Password Updated Successfully' };
            }
            throw new apiError_1.ServiceError('Invalid Password or User', common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async findOne(conditions) {
        try {
            const res = await this.UserModel.findOne(Object.assign(Object.assign({}, conditions), { is_deleted: false }));
            return this.mapper.map(res, user_model_1.UserModel, User_1.UserCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.UserModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async userWithPassword(conditions) {
        try {
            const res = await this.UserModel.findOne(conditions);
            return this.mapper.map(res, user_model_1.UserModel, User_1.UserCompleteResponsewithPasswordDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async dropDatabase() {
        try {
            await this.UserModel.db.dropDatabase();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteOne(id) {
        try {
            const res = await this.UserModel.findOneAndUpdate({
                _id: id,
                is_deleted: false,
            }, {
                is_deleted: true,
            }, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            return common_1.HttpStatus.NO_CONTENT;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
UserManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.UserModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], UserManagerService);
exports.UserManagerService = UserManagerService;


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCompleteResponsewithPasswordDto = exports.UserCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class UserCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], UserCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "username", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "role", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "full_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponseDto.prototype, "img_url", void 0);
exports.UserCompleteResponseDto = UserCompleteResponseDto;
class UserCompleteResponsewithPasswordDto extends UserCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserCompleteResponsewithPasswordDto.prototype, "password", void 0);
exports.UserCompleteResponsewithPasswordDto = UserCompleteResponsewithPasswordDto;


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class UserPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], UserPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "username", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "role", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "full_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], UserPartialResponseDto.prototype, "img_url", void 0);
exports.UserPartialResponseDto = UserPartialResponseDto;


/***/ }),
/* 97 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModelSchema = exports.UserModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const enum_1 = __webpack_require__(60);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
let UserModel = class UserModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], UserModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    username: v,
                });
                return count === 0;
            },
            message: 'username must be unique',
        },
    }),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function (v) {
                const count = await this.constructor.countDocuments({
                    email: v,
                });
                return count === 0;
            },
            message: 'email must be unique',
        },
    }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], UserModel.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, enum: enum_1.USER_ROLE_ENUM, default: enum_1.USER_ROLE_ENUM.ADMIN }),
    __metadata("design:type", String)
], UserModel.prototype, "role", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], UserModel.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], UserModel.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, mongoose_1.Prop)({
        required: true,
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrOoRit4Bt6C-dwz_WixUYxhpkc_L9jCI1Vw&usqp=CAU',
    }),
    __metadata("design:type", String)
], UserModel.prototype, "img_url", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsBoolean)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], UserModel.prototype, "is_deleted", void 0);
UserModel = __decorate([
    (0, mongoose_1.Schema)()
], UserModel);
exports.UserModel = UserModel;
exports.UserModelSchema = mongoose_1.SchemaFactory.createForClass(UserModel);


/***/ }),
/* 99 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VendorManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const Vendor_1 = __webpack_require__(30);
const VendorPartial_1 = __webpack_require__(100);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const vendor_model_1 = __webpack_require__(82);
let VendorManagerService = class VendorManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, VendorModel) {
        super(mapper);
        this.mapper = mapper;
        this.VendorModel = VendorModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, vendor_model_1.VendorModel, VendorPartial_1.VendorPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)));
            (0, core_1.createMap)(mapper, vendor_model_1.VendorModel, Vendor_1.VendorCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.contacts, (0, core_1.mapFrom)(s => s.contacts_id)), (0, core_1.forMember)(d => d.tags, (0, core_1.mapFrom)(s => s.tags)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.VendorModel.create(createPayloadDto);
            return this.mapper.map(res, vendor_model_1.VendorModel, Vendor_1.VendorCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.VendorModel.aggregate([
                {
                    $match: { _id: new mongodb_1.ObjectId(id) },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contacts_id',
                        foreignField: '_id',
                        as: 'contacts_id',
                    },
                },
                {
                    $lookup: {
                        from: 'tagmodels',
                        localField: 'tags',
                        foreignField: '_id',
                        as: 'tags',
                    },
                },
            ]);
            return this.mapper.map(res[0], vendor_model_1.VendorModel, Vendor_1.VendorCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.VendorModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, vendor_model_1.VendorModel, Vendor_1.VendorCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async assignContacts(id, contactUpdatePayloadDto) {
        try {
            const alreadExists = await this.VendorModel.findOne({
                _id: new mongodb_1.ObjectId(id),
                contacts_id: new mongodb_1.ObjectId(contactUpdatePayloadDto.contact_id),
            });
            if (alreadExists) {
                const res = await this.VendorModel.findOneAndUpdate({
                    _id: id,
                }, {
                    $pull: {
                        contacts_id: contactUpdatePayloadDto.contact_id,
                    },
                }, { new: true, overwrite: false });
                if (!res) {
                    throw new apiError_1.ServiceError('Failed To Update Contact', common_1.HttpStatus.BAD_REQUEST);
                }
                return this.mapper.map(res, vendor_model_1.VendorModel, Vendor_1.VendorCompleteResponseDto);
            }
            const res = await this.VendorModel.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $push: {
                    contacts_id: [contactUpdatePayloadDto.contact_id],
                },
            }, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError('Failed To Update Contact', common_1.HttpStatus.BAD_REQUEST);
            }
            return this.mapper.map(res, vendor_model_1.VendorModel, Vendor_1.VendorCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['first_name', 'last_name', 'vendor_name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.VendorModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.VendorModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, vendor_model_1.VendorModel, VendorPartial_1.VendorPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.VendorModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async dropDatabase() {
        try {
            await this.VendorModel.db.dropDatabase();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
VendorManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], VendorManagerService);
exports.VendorManagerService = VendorManagerService;


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VendorPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class VendorPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], VendorPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "username", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "email", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "first_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "last_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "address_1", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "address_2", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "city", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], VendorPartialResponseDto.prototype, "tags", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "state", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "zip", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "vendor_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "alias", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "phone_number", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "scope_of_work", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], VendorPartialResponseDto.prototype, "title", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], VendorPartialResponseDto.prototype, "direct_dial", void 0);
exports.VendorPartialResponseDto = VendorPartialResponseDto;


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ManagerModule = void 0;
const classes_1 = __webpack_require__(21);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(9);
const jwt_1 = __webpack_require__(13);
const mongoose_1 = __webpack_require__(19);
const building_block_1 = __webpack_require__(102);
const EmailService_1 = __webpack_require__(52);
const assign_project_service_1 = __webpack_require__(54);
const assign_project_manager_service_1 = __webpack_require__(16);
const auto_notification_service_1 = __webpack_require__(105);
const auto_notification_manager_service_1 = __webpack_require__(106);
const bullmq_module_1 = __webpack_require__(113);
const client_service_1 = __webpack_require__(114);
const client_manager_service_1 = __webpack_require__(36);
const communication_service_1 = __webpack_require__(110);
const communication_manager_service_1 = __webpack_require__(115);
const communication_template_service_1 = __webpack_require__(117);
const communication_template_manager_service_1 = __webpack_require__(43);
const compliance_service_1 = __webpack_require__(55);
const compliance_manager_service_1 = __webpack_require__(118);
const contact_service_1 = __webpack_require__(120);
const contact_manager_service_1 = __webpack_require__(47);
const database_module_1 = __webpack_require__(121);
const document_upload_service_1 = __webpack_require__(119);
const document_upload_manager_service_1 = __webpack_require__(124);
const escalation_service_1 = __webpack_require__(128);
const escalation_manager_service_1 = __webpack_require__(129);
const file_manager_service_1 = __webpack_require__(131);
const file_manager_interface_1 = __webpack_require__(134);
const otp_service_1 = __webpack_require__(135);
const otp_manager_service_1 = __webpack_require__(50);
const project_manager_service_1 = __webpack_require__(56);
const project_service_1 = __webpack_require__(111);
const coverage_type_service_1 = __webpack_require__(136);
const document_category_service_1 = __webpack_require__(137);
const document_type_service_1 = __webpack_require__(138);
const master_requirement_service_1 = __webpack_require__(87);
const requirements_service_1 = __webpack_require__(139);
const template_service_1 = __webpack_require__(83);
const coverage_type_manager_service_1 = __webpack_require__(63);
const document_category_manager_service_1 = __webpack_require__(67);
const document_type_manager_service_1 = __webpack_require__(71);
const master_requirement_manager_service_1 = __webpack_require__(75);
const requirements_manager_service_1 = __webpack_require__(78);
const template_manager_service_1 = __webpack_require__(85);
const tag_service_1 = __webpack_require__(140);
const tag_manager_service_1 = __webpack_require__(141);
const upload_manager_service_1 = __webpack_require__(88);
const upload_service_1 = __webpack_require__(145);
const user_service_1 = __webpack_require__(146);
const user_manager_service_1 = __webpack_require__(94);
const vendor_service_1 = __webpack_require__(112);
const vendor_manager_service_1 = __webpack_require__(99);
let ManagerModule = class ManagerModule {
};
ManagerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({}),
            mongoose_1.MongooseModule.forRoot(`${process.env.DB_URL}`),
            building_block_1.BuildingBlockModule,
            database_module_1.DatabaseModule,
            bullmq_module_1.BullMQModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return {
                        secret: configService.get('JWT_SECRET') || 'secret',
                        signOptions: { expiresIn: '7d' },
                    };
                },
            }),
            nestjs_1.AutomapperModule.forRoot({
                strategyInitializer: (0, classes_1.classes)(),
            }),
        ],
        providers: [
            tag_manager_service_1.TagManagerService,
            user_manager_service_1.UserManagerService,
            EmailService_1.EmailService,
            otp_manager_service_1.OtpManagerService,
            client_manager_service_1.ClientManagerService,
            contact_manager_service_1.ContactManagerService,
            vendor_manager_service_1.VendorManagerService,
            coverage_type_manager_service_1.CoverageTypeManagerService,
            document_category_manager_service_1.DocumentCategoryManagerService,
            document_type_manager_service_1.DocumentTypeManagerService,
            master_requirement_manager_service_1.MasterRequirementManagerService,
            requirements_manager_service_1.RequirementsService,
            template_manager_service_1.TemplateManagerService,
            communication_template_manager_service_1.CommunicationTemplateManagerService,
            project_manager_service_1.ProjectManagerService,
            upload_manager_service_1.UploadManagerService,
            compliance_manager_service_1.ComplianceManagerService,
            file_manager_service_1.FileManagerService,
            auto_notification_manager_service_1.AutoNotificationManagerService,
            escalation_manager_service_1.EscalationManagerService,
            communication_manager_service_1.CommunicationManagerService,
            {
                provide: auto_notification_service_1.IAutoNotificationService,
                useClass: auto_notification_manager_service_1.AutoNotificationManagerService,
            },
            { provide: user_service_1.IUserService, useClass: user_manager_service_1.UserManagerService },
            { provide: client_service_1.IClientService, useClass: client_manager_service_1.ClientManagerService },
            { provide: contact_service_1.IContactService, useClass: contact_manager_service_1.ContactManagerService },
            { provide: vendor_service_1.IVendorService, useClass: vendor_manager_service_1.VendorManagerService },
            {
                provide: master_requirement_service_1.IMasterRequirementService,
                useClass: master_requirement_manager_service_1.MasterRequirementManagerService,
            },
            { provide: requirements_service_1.IRequirementService, useClass: requirements_manager_service_1.RequirementsService },
            { provide: document_type_service_1.IDocumentTypeService, useClass: document_type_manager_service_1.DocumentTypeManagerService },
            { provide: template_service_1.ITemplateService, useClass: template_manager_service_1.TemplateManagerService },
            { provide: coverage_type_service_1.ICoverageTypeService, useClass: coverage_type_manager_service_1.CoverageTypeManagerService },
            {
                provide: document_category_service_1.IDocumentCategoryService,
                useClass: document_category_manager_service_1.DocumentCategoryManagerService,
            },
            { provide: assign_project_service_1.IAssignProjectService, useClass: assign_project_manager_service_1.AssignProjectManagerService },
            { provide: project_service_1.IProjectService, useClass: project_manager_service_1.ProjectManagerService },
            { provide: upload_service_1.IUploadService, useClass: upload_manager_service_1.UploadManagerService },
            assign_project_manager_service_1.AssignProjectManagerService,
            { provide: otp_service_1.IOtpService, useClass: otp_manager_service_1.OtpManagerService },
            { provide: compliance_service_1.IComplianceService, useClass: compliance_manager_service_1.ComplianceManagerService },
            { provide: document_upload_service_1.IDocumentUploadService, useClass: document_upload_manager_service_1.DocumentUploadManagerService },
            {
                provide: communication_template_service_1.ICommunicationTemplateService,
                useClass: communication_template_manager_service_1.CommunicationTemplateManagerService,
            },
            {
                provide: file_manager_interface_1.IFileManagerService,
                useClass: file_manager_service_1.FileManagerService,
            },
            {
                provide: tag_service_1.ITagService,
                useClass: tag_manager_service_1.TagManagerService,
            },
            {
                provide: escalation_service_1.IEscalationService,
                useClass: escalation_manager_service_1.EscalationManagerService,
            },
            {
                provide: communication_service_1.ICommunicationService,
                useClass: communication_manager_service_1.CommunicationManagerService,
            },
        ],
        exports: [
            database_module_1.DatabaseModule,
            tag_manager_service_1.TagManagerService,
            user_manager_service_1.UserManagerService,
            EmailService_1.EmailService,
            escalation_manager_service_1.EscalationManagerService,
            coverage_type_manager_service_1.CoverageTypeManagerService,
            document_category_manager_service_1.DocumentCategoryManagerService,
            client_manager_service_1.ClientManagerService,
            document_type_manager_service_1.DocumentTypeManagerService,
            master_requirement_manager_service_1.MasterRequirementManagerService,
            requirements_manager_service_1.RequirementsService,
            template_manager_service_1.TemplateManagerService,
            communication_template_manager_service_1.CommunicationTemplateManagerService,
            auto_notification_manager_service_1.AutoNotificationManagerService,
            communication_manager_service_1.CommunicationManagerService,
            user_service_1.IUserService,
            client_service_1.IClientService,
            contact_service_1.IContactService,
            escalation_service_1.IEscalationService,
            vendor_service_1.IVendorService,
            requirements_service_1.IRequirementService,
            document_type_service_1.IDocumentTypeService,
            master_requirement_service_1.IMasterRequirementService,
            template_service_1.ITemplateService,
            assign_project_service_1.IAssignProjectService,
            coverage_type_service_1.ICoverageTypeService,
            document_category_service_1.IDocumentCategoryService,
            project_service_1.IProjectService,
            upload_service_1.IUploadService,
            assign_project_manager_service_1.AssignProjectManagerService,
            otp_service_1.IOtpService,
            compliance_service_1.IComplianceService,
            document_upload_service_1.IDocumentUploadService,
            communication_template_service_1.ICommunicationTemplateService,
            file_manager_service_1.FileManagerService,
            file_manager_interface_1.IFileManagerService,
            auto_notification_service_1.IAutoNotificationService,
            tag_service_1.ITagService,
            communication_service_1.ICommunicationService,
        ],
    })
], ManagerModule);
exports.ManagerModule = ManagerModule;


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(103), exports);
__exportStar(__webpack_require__(104), exports);


/***/ }),
/* 103 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuildingBlockModule = void 0;
const common_1 = __webpack_require__(1);
const building_block_service_1 = __webpack_require__(104);
let BuildingBlockModule = class BuildingBlockModule {
};
BuildingBlockModule = __decorate([
    (0, common_1.Module)({
        providers: [building_block_service_1.BuildingBlockService],
        exports: [building_block_service_1.BuildingBlockService],
    })
], BuildingBlockModule);
exports.BuildingBlockModule = BuildingBlockModule;


/***/ }),
/* 104 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuildingBlockService = void 0;
const common_1 = __webpack_require__(1);
let BuildingBlockService = class BuildingBlockService {
};
BuildingBlockService = __decorate([
    (0, common_1.Injectable)()
], BuildingBlockService);
exports.BuildingBlockService = BuildingBlockService;


/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IAutoNotificationService = void 0;
class IAutoNotificationService {
}
exports.IAutoNotificationService = IAutoNotificationService;


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoNotificationManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(57);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(58);
const AutoNotifcation_1 = __webpack_require__(107);
const apiError_1 = __webpack_require__(31);
const enum_1 = __webpack_require__(60);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const bullmq_2 = __webpack_require__(61);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const assign_project_model_1 = __webpack_require__(35);
const client_model_1 = __webpack_require__(42);
const communication_model_1 = __webpack_require__(109);
const communication_service_1 = __webpack_require__(110);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const project_service_1 = __webpack_require__(111);
const document_type_model_1 = __webpack_require__(74);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const vendor_service_1 = __webpack_require__(112);
const auto_notification_model_1 = __webpack_require__(108);
let AutoNotificationManagerService = class AutoNotificationManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, AutoNotificationModel, ComplianceModel, VendorModel, ClientModel, ProjectModel, DocumentTypeModel, MasterRequirementModel, AssignProjectModel, CommunicationModel, vendorService, projectService, mailerService, autoNotificationQueue, communicationService) {
        super(mapper);
        this.mapper = mapper;
        this.AutoNotificationModel = AutoNotificationModel;
        this.ComplianceModel = ComplianceModel;
        this.VendorModel = VendorModel;
        this.ClientModel = ClientModel;
        this.ProjectModel = ProjectModel;
        this.DocumentTypeModel = DocumentTypeModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.AssignProjectModel = AssignProjectModel;
        this.CommunicationModel = CommunicationModel;
        this.vendorService = vendorService;
        this.projectService = projectService;
        this.mailerService = mailerService;
        this.autoNotificationQueue = autoNotificationQueue;
        this.communicationService = communicationService;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, auto_notification_model_1.AutoNotificationModel, AutoNotifcation_1.AutoNotificationResponse, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.compliance_statuses, (0, core_1.mapFrom)(s => s.compliance_statuses)), (0, core_1.forMember)(d => d.template, (0, core_1.mapFrom)(s => s.template)), (0, core_1.forMember)(d => d.documents, (0, core_1.mapFrom)(s => s.documents)), (0, core_1.forMember)(d => d.applies_to, (0, core_1.mapFrom)(s => s.applies_to)));
        };
    }
    async create(createPayloadDto) {
        try {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            const res = await this.AutoNotificationModel.create(Object.assign(Object.assign({}, createPayloadDto), { last_sent: date }));
            return this.mapper.map(res, auto_notification_model_1.AutoNotificationModel, AutoNotifcation_1.AutoNotificationResponse);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            let res = await this.AutoNotificationModel.findOne({
                _id: id,
                is_deleted: false,
            });
            if (res) {
                const project = await this.ProjectModel.findById(res === null || res === void 0 ? void 0 : res.project_id);
                res = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(res))), { project_name: project === null || project === void 0 ? void 0 : project.name });
            }
            return this.mapper.map(res, auto_notification_model_1.AutoNotificationModel, AutoNotifcation_1.AutoNotificationResponse);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.AutoNotificationModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError(`Auto Notification not found`, common_1.HttpStatus.NOT_FOUND);
            }
            return this.mapper.map(res, auto_notification_model_1.AutoNotificationModel, AutoNotifcation_1.AutoNotificationResponse);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['name', 'type', 'template.template_name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.AutoNotificationModel.find(Object.assign(Object.assign({}, queryConditions), { is_deleted: false })).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.AutoNotificationModel.find(Object.assign(Object.assign({}, queryConditions), { is_deleted: false }))
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, auto_notification_model_1.AutoNotificationModel, AutoNotifcation_1.AutoNotificationResponse);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.AutoNotificationModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async sendNotificationEmailToVendorContacts(vendor_id, template, sender, autoNotification, deficiency_list, document_list, dashboardLink, vendorCompliance) {
        try {
            const vendor = await this.vendorService.getById(vendor_id);
            const vendorTags = template.tags.filter(tag => tag.entity_type === enum_1.AUTO_NOTIFICATION_ENTITIES.VENDOR);
            const contactTags = template.tags.filter(tag => tag.entity_type === enum_1.AUTO_NOTIFICATION_ENTITIES.CONTACT);
            let htmlTemplate = JSON.parse(JSON.stringify(template.template));
            for (const vendorTag of vendorTags) {
                if (vendor && htmlTemplate.includes(vendorTag.name)) {
                    htmlTemplate = htmlTemplate.replaceAll(new RegExp(vendorTag.name, 'g'), vendor[vendorTag.resolve_to]);
                }
                const deficiency_list_data = deficiency_list.join('');
                const document_list_data = document_list.join('');
                htmlTemplate = await htmlTemplate.replaceAll(new RegExp(`##deficienciesList##`, 'g'), deficiency_list_data);
                htmlTemplate = await htmlTemplate.replaceAll(new RegExp(`##documentList##`, 'g'), document_list_data);
            }
            const deficiency_list_data = deficiency_list.join('');
            const document_list_data = document_list.join('');
            htmlTemplate = htmlTemplate.replaceAll(new RegExp(`##deficienciesList##`, 'g'), deficiency_list_data);
            htmlTemplate = await htmlTemplate.replaceAll(new RegExp(`##documentList##`, 'g'), document_list_data);
            for (const contact of vendor === null || vendor === void 0 ? void 0 : vendor.contacts) {
                const dashboardLinkItem = dashboardLink.find(item => item.contact_id.toString() === contact._id.toString());
                if (dashboardLinkItem) {
                    const uuid = dashboardLinkItem.uuid;
                    let htmlTemplateCopy = htmlTemplate;
                    let mailOptions = null;
                    for (const contactTag of contactTags) {
                        if (contact && htmlTemplateCopy.includes(contactTag.name)) {
                            htmlTemplateCopy = await htmlTemplateCopy.replaceAll(new RegExp(contactTag.name, 'g'), contact[contactTag.resolve_to]);
                        }
                    }
                    const link = `${process.env.BASE_URL}/auth/verification?identifire=${uuid}`;
                    htmlTemplateCopy = await htmlTemplateCopy.replaceAll(new RegExp(`#dashboardlink#`, 'g'), link);
                    if (contact.type === enum_1.CONTACT_TYPE_ENUM.BROKER) {
                        if (autoNotification.producer) {
                            mailOptions = {
                                to: contact.email,
                                from: sender.email,
                                subject: vendor === null || vendor === void 0 ? void 0 : vendor._id,
                                html: htmlTemplateCopy,
                            };
                        }
                    }
                    else {
                        mailOptions = {
                            to: contact.email,
                            from: sender.email,
                            subject: vendor === null || vendor === void 0 ? void 0 : vendor._id,
                            html: htmlTemplateCopy,
                        };
                    }
                    const mail_body = {
                        vendor_id: vendor === null || vendor === void 0 ? void 0 : vendor._id,
                        notification_id: autoNotification._id,
                        contact_id: contact._id,
                        compliance_id: vendorCompliance._id,
                        project_id: vendorCompliance.project_id,
                        template_id: template._id,
                        body: htmlTemplateCopy,
                        subject: template.subject,
                        communication_type: enum_1.COMMUNICATION_TYPE.AUTO_NOTIFICATION,
                        recipient_type: enum_1.COMMUNICATION_RECIPIENT_TYPE.VENDOR,
                    };
                    await this.communicationService.create(mail_body);
                    if (mailOptions) {
                        this.mailerService.add(constants_1.MAILER_QUEUE, mailOptions);
                    }
                }
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async sendNotificationEmailToProjectContacts(project_id, template, sender, notification_id) {
        try {
            const project = await this.projectService.getById(project_id);
            const projectTags = template.tags.filter(tag => tag.entity_type === enum_1.AUTO_NOTIFICATION_ENTITIES.PROJECT);
            const contactTags = template.tags.filter(tag => tag.entity_type === enum_1.AUTO_NOTIFICATION_ENTITIES.CONTACT);
            let htmlTemplate = JSON.parse(JSON.stringify(template.template));
            for (const projectTag of projectTags) {
                if (project && htmlTemplate.includes(projectTag.name)) {
                    htmlTemplate = htmlTemplate.replaceAll(new RegExp(projectTag.name, 'g'), project[projectTag.resolve_to]);
                }
            }
            project === null || project === void 0 ? void 0 : project.contacts.forEach(async (contact) => {
                let mailOptions = {};
                for (const contactTag of contactTags) {
                    if (contact && htmlTemplate.includes(contactTag.name)) {
                        htmlTemplate = await htmlTemplate.replaceAll(new RegExp(contactTag.name, 'g'), contact[contactTag.resolve_to]);
                    }
                }
                mailOptions = {
                    to: contact.email,
                    from: sender.email,
                    subject: project._id,
                    html: htmlTemplate,
                };
                this.mailerService.add(constants_1.MAILER_QUEUE, mailOptions);
                const mail_body = {
                    notification_id: new mongodb_1.ObjectId(notification_id),
                    contact_id: contact._id,
                    project_id: new mongodb_1.ObjectId(project_id),
                    template_id: template._id,
                    subject: template.subject,
                    body: htmlTemplate,
                    communication_type: enum_1.COMMUNICATION_TYPE.AUTO_NOTIFICATION,
                    recipient_type: enum_1.COMMUNICATION_RECIPIENT_TYPE.PROJECT,
                };
                await this.communicationService.create(mail_body);
            });
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async sendNotificationEmailToClientContacts(client_id, template, sender, notification_id) {
        try {
            const client = await this.ClientModel.aggregate([
                {
                    $match: { _id: new mongodb_1.ObjectId(client_id) },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contacts_id',
                        foreignField: '_id',
                        as: 'contacts_id',
                    },
                },
            ]);
            const clientTags = template.tags.filter(tag => tag.entity_type === enum_1.AUTO_NOTIFICATION_ENTITIES.CLIENT);
            const contactTags = template.tags.filter(tag => tag.entity_type === enum_1.AUTO_NOTIFICATION_ENTITIES.CONTACT);
            let htmlTemplate = JSON.parse(JSON.stringify(template.template));
            for (const clientTag of clientTags) {
                if (htmlTemplate.includes(clientTag.name)) {
                    htmlTemplate = htmlTemplate.replaceAll(new RegExp(clientTag.name, 'g'), client[0][clientTag.resolve_to]);
                }
            }
            client[0].contacts_id.forEach(async (contact) => {
                let mailOptions = {};
                for (const contactTag of contactTags) {
                    if (contact && htmlTemplate.includes(contactTag.name)) {
                        htmlTemplate = await htmlTemplate.replaceAll(new RegExp(contactTag.name, 'g'), contact[contactTag.resolve_to]);
                    }
                }
                mailOptions = {
                    to: contact.email,
                    from: sender.email,
                    subject: client[0]._id,
                    html: htmlTemplate,
                };
                this.mailerService.add(constants_1.MAILER_QUEUE, mailOptions);
                const mail_body = {
                    notification_id: new mongodb_1.ObjectId(notification_id),
                    contact_id: contact._id,
                    project_id: new mongodb_1.ObjectId(client[0].project_id),
                    client_id: new mongodb_1.ObjectId(client_id),
                    template_id: template._id,
                    subject: template.subject,
                    body: htmlTemplate,
                    communication_type: enum_1.COMMUNICATION_TYPE.AUTO_NOTIFICATION,
                    recipient_type: enum_1.COMMUNICATION_RECIPIENT_TYPE.CLIENT,
                };
                await this.communicationService.create(mail_body);
            });
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getRecursiveNotifications() {
        try {
            const autoNotifications = await this.AutoNotificationModel.find({
                active: true,
                is_deleted: false,
                schedule_type: 'every',
                $expr: { $lt: ['$sent_times', '$count'] },
                'template.template_id': { $exists: true },
                sender: { $exists: true },
            });
            return autoNotifications;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getOneTimeNotifications() {
        try {
            const autoNotifications = await this.AutoNotificationModel.find({
                active: true,
                is_deleted: false,
                schedule_type: {
                    $ne: 'every',
                },
                'template.template_id': { $exists: true },
                sender: { $exists: true },
            });
            return autoNotifications;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async sendNotifications(autoNotifications) {
        try {
            if (autoNotifications.length > 0) {
                await this.autoNotificationQueue.add(constants_1.AUTO_NOTIFICATION_QUEUE, {
                    autoNotifications,
                });
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async startNotificationJob() {
        try {
            const recursiveNotifications = await this.getRecursiveNotifications();
            const oneTimeNotifications = await this.getOneTimeNotifications();
            await this.sendNotifications(recursiveNotifications);
            await this.sendNotifications(oneTimeNotifications);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async toggleNotification(id) {
        try {
            const autoNotification = await this.getById(id);
            if (!autoNotification) {
                throw new apiError_1.ServiceError('Auto Notification not found', common_1.HttpStatus.NOT_FOUND);
            }
            const res = await this.AutoNotificationModel.findOneAndUpdate({
                _id: id,
            }, {
                $set: {
                    active: !autoNotification.active,
                },
            }, { new: true });
            return this.mapper.map(res, auto_notification_model_1.AutoNotificationModel, AutoNotifcation_1.AutoNotificationResponse);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getRecipientsCount(id) {
        const vendorRecipients = await this.CommunicationModel.aggregate([
            {
                $match: {
                    notification_id: new mongodb_1.ObjectId(id),
                    type: 'vendor',
                },
            },
            {
                $group: {
                    _id: '$vendor_id',
                },
            },
        ]);
        const projectRecipients = await this.CommunicationModel.aggregate([
            {
                $match: {
                    notification_id: new mongodb_1.ObjectId(id),
                    type: 'project',
                },
            },
            {
                $group: {
                    _id: '$project_id',
                },
            },
        ]);
        const clientRecipients = await this.CommunicationModel.aggregate([
            {
                $match: {
                    notification_id: new mongodb_1.ObjectId(id),
                    type: 'client',
                },
            },
            {
                $group: {
                    _id: '$client_id',
                },
            },
        ]);
        return {
            vendors: vendorRecipients.length,
            projects: projectRecipients.length,
            clients: clientRecipients.length,
        };
    }
    async softDelete(id) {
        try {
            const res = await this.AutoNotificationModel.findOneAndUpdate({
                _id: id,
                is_deleted: false,
            }, {
                is_deleted: true,
            }, { new: true, overwrite: false });
            if (!res) {
                throw new apiError_1.ServiceError('Auto Notification not found', common_1.HttpStatus.NOT_FOUND);
            }
            return common_1.HttpStatus.NO_CONTENT;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getRequestDeficiencyList(vendor_id, project_id) {
        const complainces = await this.ComplianceModel.find({
            vendor_id: vendor_id,
            'compliance_items.document_name': '',
            project_id: project_id,
            status: true,
        });
        const compliance_items = [];
        const master_requirement_ids = [];
        const document_type_uuid = [];
        let masterRequirement;
        let documents;
        let dashboardLink;
        let vendorCompliance;
        for (const compliance of complainces) {
            vendorCompliance = compliance;
            dashboardLink = await this.AssignProjectModel.find({
                compliance_id: compliance._id,
                vendor_id: vendor_id,
            });
            for (const compliance_item of compliance.compliance_items) {
                if (compliance_item.document_name === '') {
                    compliance_items.push(compliance_item);
                    master_requirement_ids.push(compliance_item.master_requirement_id);
                    document_type_uuid.push(compliance_item.document_type_uuid);
                }
                masterRequirement = await this.MasterRequirementModel.find({
                    _id: { $in: master_requirement_ids },
                });
                documents = await this.DocumentTypeModel.find({
                    uuid: { $in: document_type_uuid },
                });
            }
            return {
                masterRequirement,
                documents,
                dashboardLink,
                vendorCompliance,
            };
        }
    }
};
AutoNotificationManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(auto_notification_model_1.AutoNotificationModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(5, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(6, (0, mongoose_1.InjectModel)(document_type_model_1.DocumentTypeModel.name)),
    __param(7, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __param(8, (0, mongoose_1.InjectModel)(assign_project_model_1.AssignProjectModel.name)),
    __param(9, (0, mongoose_1.InjectModel)(communication_model_1.CommunicationModel.name)),
    __param(12, (0, bullmq_1.InjectQueue)(constants_1.MAILER_QUEUE)),
    __param(13, (0, bullmq_1.InjectQueue)(constants_1.AUTO_NOTIFICATION_QUEUE)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _g : Object, typeof (_h = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _h : Object, typeof (_j = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _j : Object, typeof (_k = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _k : Object, typeof (_l = typeof vendor_service_1.IVendorService !== "undefined" && vendor_service_1.IVendorService) === "function" ? _l : Object, typeof (_m = typeof project_service_1.IProjectService !== "undefined" && project_service_1.IProjectService) === "function" ? _m : Object, typeof (_o = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _o : Object, typeof (_p = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _p : Object, typeof (_q = typeof communication_service_1.ICommunicationService !== "undefined" && communication_service_1.ICommunicationService) === "function" ? _q : Object])
], AutoNotificationManagerService);
exports.AutoNotificationManagerService = AutoNotificationManagerService;


/***/ }),
/* 107 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoNotificationResponse = void 0;
const classes_1 = __webpack_require__(21);
const auto_notification_model_1 = __webpack_require__(108);
const mongodb_1 = __webpack_require__(25);
class AutoNotificationResponse {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], AutoNotificationResponse.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], AutoNotificationResponse.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], AutoNotificationResponse.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], AutoNotificationResponse.prototype, "applies_to", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], AutoNotificationResponse.prototype, "compliance_statuses", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], AutoNotificationResponse.prototype, "documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], AutoNotificationResponse.prototype, "days", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], AutoNotificationResponse.prototype, "schedule_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof auto_notification_model_1.Template !== "undefined" && auto_notification_model_1.Template) === "function" ? _b : Object)
], AutoNotificationResponse.prototype, "template", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], AutoNotificationResponse.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], AutoNotificationResponse.prototype, "last_sent", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], AutoNotificationResponse.prototype, "sender", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], AutoNotificationResponse.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], AutoNotificationResponse.prototype, "company_manager", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], AutoNotificationResponse.prototype, "producer", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], AutoNotificationResponse.prototype, "count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], AutoNotificationResponse.prototype, "sent_times", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], AutoNotificationResponse.prototype, "project_name", void 0);
exports.AutoNotificationResponse = AutoNotificationResponse;


/***/ }),
/* 108 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoNotificationModelSchema = exports.AutoNotificationModel = exports.TemplateSchema = exports.Template = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let Template = class Template {
};
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], Template.prototype, "template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Template.prototype, "template_name", void 0);
Template = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Template);
exports.Template = Template;
exports.TemplateSchema = mongoose_1.SchemaFactory.createForClass(Template);
let AutoNotificationModel = class AutoNotificationModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], AutoNotificationModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], AutoNotificationModel.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, enum: ['update', 'request'], required: true }),
    __metadata("design:type", String)
], AutoNotificationModel.prototype, "type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], AutoNotificationModel.prototype, "days", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String, enum: ['before', 'after', 'every'] }),
    __metadata("design:type", String)
], AutoNotificationModel.prototype, "schedule_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [mongoose_2.SchemaTypes.ObjectId] }),
    __metadata("design:type", Array)
], AutoNotificationModel.prototype, "applies_to", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], AutoNotificationModel.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], AutoNotificationModel.prototype, "compliance_statuses", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], AutoNotificationModel.prototype, "documents", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: exports.TemplateSchema }),
    __metadata("design:type", Template)
], AutoNotificationModel.prototype, "template", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], AutoNotificationModel.prototype, "sender", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], AutoNotificationModel.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], AutoNotificationModel.prototype, "is_deleted", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], AutoNotificationModel.prototype, "last_sent", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], AutoNotificationModel.prototype, "company_manager", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], AutoNotificationModel.prototype, "producer", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], AutoNotificationModel.prototype, "count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], AutoNotificationModel.prototype, "sent_times", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], AutoNotificationModel.prototype, "project_name", void 0);
AutoNotificationModel = __decorate([
    (0, mongoose_1.Schema)()
], AutoNotificationModel);
exports.AutoNotificationModel = AutoNotificationModel;
exports.AutoNotificationModelSchema = mongoose_1.SchemaFactory.createForClass(AutoNotificationModel);


/***/ }),
/* 109 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationModelSchema = exports.CommunicationModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const enum_1 = __webpack_require__(60);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const auto_notification_model_1 = __webpack_require__(108);
const contact_model_1 = __webpack_require__(49);
const vendor_model_1 = __webpack_require__(82);
let CommunicationModel = class CommunicationModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CommunicationModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], CommunicationModel.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], CommunicationModel.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], CommunicationModel.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], CommunicationModel.prototype, "notification_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_f = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _f : Object)
], CommunicationModel.prototype, "template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_g = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _g : Object)
], CommunicationModel.prototype, "compliance_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_h = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _h : Object)
], CommunicationModel.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId }),
    __metadata("design:type", typeof (_j = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _j : Object)
], CommunicationModel.prototype, "escalation_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: enum_1.COMMUNICATION_TYPE,
    }),
    __metadata("design:type", String)
], CommunicationModel.prototype, "communication_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: enum_1.COMMUNICATION_RECIPIENT_TYPE,
    }),
    __metadata("design:type", String)
], CommunicationModel.prototype, "recipient_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], CommunicationModel.prototype, "subject", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], CommunicationModel.prototype, "body", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.Date, default: Date.now }),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], CommunicationModel.prototype, "timestamp", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_l = typeof vendor_model_1.VendorModelDocument !== "undefined" && vendor_model_1.VendorModelDocument) === "function" ? _l : Object)
], CommunicationModel.prototype, "vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_m = typeof auto_notification_model_1.AutoNotificationModelDocument !== "undefined" && auto_notification_model_1.AutoNotificationModelDocument) === "function" ? _m : Object)
], CommunicationModel.prototype, "notification", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_o = typeof contact_model_1.ContactModelDocument !== "undefined" && contact_model_1.ContactModelDocument) === "function" ? _o : Object)
], CommunicationModel.prototype, "contact", void 0);
CommunicationModel = __decorate([
    (0, mongoose_1.Schema)()
], CommunicationModel);
exports.CommunicationModel = CommunicationModel;
exports.CommunicationModelSchema = mongoose_1.SchemaFactory.createForClass(CommunicationModel);


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICommunicationService = void 0;
class ICommunicationService {
}
exports.ICommunicationService = ICommunicationService;


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IProjectService = void 0;
class IProjectService {
}
exports.IProjectService = IProjectService;


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IVendorService = void 0;
class IVendorService {
}
exports.IVendorService = IVendorService;


/***/ }),
/* 113 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BullMQModule = void 0;
const bullmq_1 = __webpack_require__(57);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(9);
const constants_1 = __webpack_require__(58);
let BullMQModule = class BullMQModule {
};
BullMQModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                    limiter: {
                        max: 20,
                        duration: 5000,
                        bounceBack: false,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: constants_1.VENDOR_COMPLIANCE_QUEUE }, { name: constants_1.PROJECT_ASSIGNEE_QUEUE }, { name: constants_1.MAILER_QUEUE }, { name: constants_1.COMPLIANCE_UPDATE_REQUIREMENT_CHANGE_QUEUE }, { name: constants_1.COMPLIANCE_UPDATE_REQUIREMENT_TEMP_CHANGE_QUEUE }, { name: constants_1.TEMPLATE_UPDATE_QUEUE }, { name: constants_1.ESCALATION_QUEUE }, { name: constants_1.AUTO_NOTIFICATION_QUEUE }),
        ],
        exports: [bullmq_1.BullModule],
    })
], BullMQModule);
exports.BullMQModule = BullMQModule;


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IClientService = void 0;
class IClientService {
}
exports.IClientService = IClientService;


/***/ }),
/* 115 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const Communication_1 = __webpack_require__(116);
const errorHandler_1 = __webpack_require__(32);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const auto_notification_model_1 = __webpack_require__(108);
const vendor_model_1 = __webpack_require__(82);
const communication_model_1 = __webpack_require__(109);
let CommunicationManagerService = class CommunicationManagerService extends nestjs_1.AutomapperProfile {
    constructor(communicationModel, vendorModel, autoNotificationModel, mapper) {
        super(mapper);
        this.communicationModel = communicationModel;
        this.vendorModel = vendorModel;
        this.autoNotificationModel = autoNotificationModel;
        this.mapper = mapper;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, communication_model_1.CommunicationModel, Communication_1.CommunicationResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.vendor_id, (0, core_1.mapFrom)(s => s.vendor_id)), (0, core_1.forMember)(d => d.project_id, (0, core_1.mapFrom)(s => s.project_id)), (0, core_1.forMember)(d => d.contact_id, (0, core_1.mapFrom)(s => s.contact_id)), (0, core_1.forMember)(d => d.notification_id, (0, core_1.mapFrom)(s => s.notification_id)), (0, core_1.forMember)(d => d.template_id, (0, core_1.mapFrom)(s => s.template_id)), (0, core_1.forMember)(d => d.compliance_id, (0, core_1.mapFrom)(s => s.compliance_id)), (0, core_1.forMember)(d => d.client_id, (0, core_1.mapFrom)(s => s.client_id)), (0, core_1.forMember)(d => d.communication_type, (0, core_1.mapFrom)(s => s.communication_type)), (0, core_1.forMember)(d => d.recipient_type, (0, core_1.mapFrom)(s => s.recipient_type)), (0, core_1.forMember)(d => d.notification, (0, core_1.mapFrom)(s => s.notification)), (0, core_1.forMember)(d => d.vendor, (0, core_1.mapFrom)(s => s.vendor)), (0, core_1.forMember)(d => d.contact, (0, core_1.mapFrom)(s => s.contact)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.communicationModel.create(createPayloadDto);
            return this.mapper.map(res, communication_model_1.CommunicationModel, Communication_1.CommunicationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async find(conditions) {
        try {
            if (conditions.project_id) {
                conditions.project_id = new mongodb_1.ObjectId(conditions.project_id);
            }
            if (conditions.vendor_id) {
                conditions.vendor_id = new mongodb_1.ObjectId(conditions.vendor_id);
            }
            const res = await this.communicationModel.aggregate([
                {
                    $match: conditions,
                },
                {
                    $lookup: {
                        from: 'vendormodels',
                        localField: 'vendor_id',
                        foreignField: '_id',
                        as: 'vendor',
                    },
                },
                {
                    $lookup: {
                        from: 'autonotificationmodels',
                        localField: 'notification_id',
                        foreignField: '_id',
                        as: 'notification',
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contact_id',
                        foreignField: '_id',
                        as: 'contact',
                    },
                },
                {
                    $unwind: {
                        path: '$vendor',
                    },
                },
                {
                    $unwind: {
                        path: '$notification',
                    },
                },
                {
                    $unwind: {
                        path: '$contact',
                    },
                },
                {
                    $lookup: {
                        from: 'usermodels',
                        localField: 'notification.sender',
                        foreignField: '_id',
                        as: 'notification.sender',
                    },
                },
                {
                    $unwind: {
                        path: '$notification.sender',
                    },
                },
            ]);
            return this.mapper.mapArray(res, communication_model_1.CommunicationModel, Communication_1.CommunicationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
CommunicationManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(communication_model_1.CommunicationModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(auto_notification_model_1.AutoNotificationModel.name)),
    __param(3, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _d : Object])
], CommunicationManagerService);
exports.CommunicationManagerService = CommunicationManagerService;


/***/ }),
/* 116 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommunicationResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const auto_notification_model_1 = __webpack_require__(108);
const contact_model_1 = __webpack_require__(49);
const vendor_model_1 = __webpack_require__(82);
const mongodb_1 = __webpack_require__(25);
class CommunicationResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], CommunicationResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], CommunicationResponseDto.prototype, "vendor_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_c = typeof vendor_model_1.VendorModelDocument !== "undefined" && vendor_model_1.VendorModelDocument) === "function" ? _c : Object)
], CommunicationResponseDto.prototype, "vendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], CommunicationResponseDto.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], CommunicationResponseDto.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_f = typeof contact_model_1.ContactModelDocument !== "undefined" && contact_model_1.ContactModelDocument) === "function" ? _f : Object)
], CommunicationResponseDto.prototype, "contact", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_g = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _g : Object)
], CommunicationResponseDto.prototype, "notification_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_h = typeof auto_notification_model_1.AutoNotificationModelDocument !== "undefined" && auto_notification_model_1.AutoNotificationModelDocument) === "function" ? _h : Object)
], CommunicationResponseDto.prototype, "notification", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_j = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _j : Object)
], CommunicationResponseDto.prototype, "template_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_k = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _k : Object)
], CommunicationResponseDto.prototype, "compliance_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_l = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _l : Object)
], CommunicationResponseDto.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_m = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _m : Object)
], CommunicationResponseDto.prototype, "escalation_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationResponseDto.prototype, "communication_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationResponseDto.prototype, "recipient_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationResponseDto.prototype, "subject", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CommunicationResponseDto.prototype, "body", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_o = typeof Date !== "undefined" && Date) === "function" ? _o : Object)
], CommunicationResponseDto.prototype, "timestamp", void 0);
exports.CommunicationResponseDto = CommunicationResponseDto;


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICommunicationTemplateService = void 0;
class ICommunicationTemplateService {
}
exports.ICommunicationTemplateService = ICommunicationTemplateService;


/***/ }),
/* 118 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplianceManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const Compliance_1 = __webpack_require__(22);
const apiError_1 = __webpack_require__(31);
const enum_1 = __webpack_require__(60);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const document_upload_model_1 = __webpack_require__(81);
const document_upload_service_1 = __webpack_require__(119);
const project_service_1 = __webpack_require__(111);
const master_requirement_service_1 = __webpack_require__(87);
const master_requirement_model_1 = __webpack_require__(33);
const requirements_model_1 = __webpack_require__(84);
const template_model_1 = __webpack_require__(34);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const compliance_model_1 = __webpack_require__(62);
let ComplianceManagerService = class ComplianceManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, ComplianceModel, RequirementModel, DocumentUploadModel, template, TemplateModel, masterRequirement, documentUpload, projectService, masterRequirementModel) {
        super(mapper);
        this.mapper = mapper;
        this.ComplianceModel = ComplianceModel;
        this.RequirementModel = RequirementModel;
        this.DocumentUploadModel = DocumentUploadModel;
        this.template = template;
        this.TemplateModel = TemplateModel;
        this.masterRequirement = masterRequirement;
        this.documentUpload = documentUpload;
        this.projectService = projectService;
        this.masterRequirementModel = masterRequirementModel;
        this.logger = new common_1.Logger();
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto, (0, core_1.forMember)(d => d.compliance_items, (0, core_1.mapFrom)(s => s.compliance_items)), (0, core_1.forMember)(d => d.template_items, (0, core_1.mapFrom)(s => s.template_items)), (0, core_1.forMember)(d => d.project, (0, core_1.mapFrom)(s => s.project)), (0, core_1.forMember)(d => d.escalation_id, (0, core_1.mapFrom)(s => s.escalation_id)));
        };
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['project_name', 'client_name']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const totalCount = await this.ComplianceModel.find(queryConditions).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.ComplianceModel.find(queryConditions)
                .skip(skip)
                .limit(pagination.limit)
                .sort({ _id: -1 });
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async create(complianceCreatorPayloadDto) {
        const compliance_items = [];
        const template_items = [];
        const req_group = await this.RequirementModel.aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(complianceCreatorPayloadDto.requirement_group_id),
                },
            },
            {
                $lookup: {
                    from: 'masterrequirementmodels',
                    localField: 'requirement_items',
                    foreignField: '_id',
                    as: 'requirement_items',
                },
            },
        ]);
        req_group[0].requirement_items.forEach((requirement) => compliance_items.push(Object.assign({ master_requirement_id: requirement._id, required_limit: requirement.requirement_rule, actual_limit: '', status: enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED, comment: requirement.default_comment, show: true, waiver: false, post_closing: false, document_name: '', original_filename: '', document_type_uuid: requirement.document_type_uuid }, (requirement.OCR_KEY && {
            OCR_KEY: requirement.OCR_KEY,
        }))));
        if (req_group[0].acord25template_id) {
            const acord25template = await this.TemplateModel.aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(req_group[0].acord25template_id),
                    },
                },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        localField: 'rules.master_requirement_id',
                        foreignField: '_id',
                        as: 'rule_requirement',
                    },
                },
                {
                    $addFields: {
                        rules: {
                            $map: {
                                input: '$rules',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            master_requirement_detail: {
                                                $arrayElemAt: [
                                                    '$rule_requirement',
                                                    {
                                                        $indexOfArray: [
                                                            '$rule_requirement._id',
                                                            '$$rel.master_requirement_id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            ]);
            acord25template[0].rules.forEach((rule) => {
                if (rule.is_enabled) {
                    template_items.push(Object.assign({ template_id: req_group[0].acord25template_id, template_rule_id: rule._id, actual_limit: '', status: enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED, show: true, waiver: false, post_closing: false, document_name: '', original_filename: '', master_requirement_id: rule.master_requirement_detail._id, document_type_uuid: rule.master_requirement_detail.document_type_uuid }, (rule.master_requirement_detail.OCR_KEY && {
                        OCR_KEY: rule.master_requirement_detail.OCR_KEY,
                    })));
                }
            });
        }
        if (req_group[0].acord28template_id) {
            const acord28template = await this.TemplateModel.aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(req_group[0].acord28template_id),
                    },
                },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        localField: 'rules.master_requirement_id',
                        foreignField: '_id',
                        as: 'rule_requirement',
                    },
                },
                {
                    $addFields: {
                        rules: {
                            $map: {
                                input: '$rules',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            master_requirement_detail: {
                                                $arrayElemAt: [
                                                    '$rule_requirement',
                                                    {
                                                        $indexOfArray: [
                                                            '$rule_requirement._id',
                                                            '$$rel.master_requirement_id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            ]);
            acord28template[0].rules.forEach((rule) => {
                if (rule.is_enabled) {
                    template_items.push(Object.assign({ template_id: req_group[0].acord28template_id, template_rule_id: rule._id, actual_limit: '', status: enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED, show: true, waiver: false, post_closing: false, document_name: '', original_filename: '', policy_number: '', named_insured: '', master_requirement_id: rule.master_requirement_detail._id, document_type_uuid: rule.master_requirement_detail.document_type_uuid }, (rule.master_requirement_detail.OCR_KEY && {
                        OCR_KEY: rule.master_requirement_detail.OCR_KEY,
                    })));
                }
            });
        }
        try {
            const compliance = await this.ComplianceModel.create({
                user_id: complianceCreatorPayloadDto.user_id,
                vendor_id: complianceCreatorPayloadDto.vendor_id,
                vendor_name: complianceCreatorPayloadDto.vendor_name,
                project_id: complianceCreatorPayloadDto.project_id,
                project_name: complianceCreatorPayloadDto.project_name,
                requirement_group_id: complianceCreatorPayloadDto.requirement_group_id,
                client_id: complianceCreatorPayloadDto.client_id,
                client_name: complianceCreatorPayloadDto.client_name,
                compliance_items,
                template_items,
            });
            return this.mapper.map(compliance, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto, contactId) {
        try {
            const condition = {
                _id: id,
            };
            const filename = {};
            if (updatePayloadDto.item_type === 'compliance') {
                condition['compliance_items._id'] = new mongodb_1.ObjectId(updatePayloadDto.item_id);
                filename['compliance_items.$.document_name'] =
                    updatePayloadDto.file_name;
                filename['compliance_items.$.original_filename'] =
                    updatePayloadDto.original_filename;
                filename['compliance_items.$.status'] =
                    enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
            }
            if (updatePayloadDto.item_type === 'template') {
                condition['template_items._id'] = new mongodb_1.ObjectId(updatePayloadDto.item_id);
                filename['template_items.$.document_name'] = updatePayloadDto.file_name;
                filename['template_items.$.original_filename'] =
                    updatePayloadDto.original_filename;
                filename['template_items.$.status'] =
                    enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
            }
            const compliance = await this.ComplianceModel.findOneAndUpdate(condition, {
                $set: filename,
            }, { new: true });
            let document_type_uuid = null;
            let masterReqId;
            let templateRuleId;
            if (compliance && updatePayloadDto.item_type === 'compliance') {
                compliance.compliance_items.forEach(item => {
                    if (item._id.toString() === updatePayloadDto.item_id.toString()) {
                        document_type_uuid = item.document_type_uuid;
                        masterReqId = item.master_requirement_id;
                    }
                });
            }
            if (compliance && updatePayloadDto.item_type === 'template') {
                compliance.template_items.forEach(item => {
                    if (item._id.toString() === updatePayloadDto.item_id.toString()) {
                        document_type_uuid = item.document_type_uuid;
                        templateRuleId = item.template_rule_id;
                    }
                });
            }
            if (compliance && document_type_uuid) {
                const payload = {
                    compliance_id: new mongodb_1.ObjectId(id),
                    item_type: updatePayloadDto.item_type,
                    item_id: new mongodb_1.ObjectId(updatePayloadDto.item_id),
                    contact_id: new mongodb_1.ObjectId(contactId),
                    document_type_uuid: document_type_uuid,
                    is_read: false,
                };
                if (masterReqId) {
                    payload.masterReqId = masterReqId;
                }
                if (templateRuleId) {
                    payload.templateRuleId = templateRuleId;
                }
                this.documentUpload.create(payload);
            }
            if (document_type_uuid != null) {
                await this.ComplianceModel.updateMany({
                    _id: id,
                }, {
                    $set: {
                        'template_items.$[element].document_name': updatePayloadDto.file_name,
                        'template_items.$[element].original_filename': updatePayloadDto.original_filename,
                        'template_items.$[element].status': enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
                    },
                    $unset: {
                        'template_items.$[element].effective_date': '',
                        'template_items.$[element].expiry_date': '',
                    },
                }, {
                    arrayFilters: [
                        { 'element.document_type_uuid': document_type_uuid },
                    ],
                });
                await this.ComplianceModel.updateMany({
                    _id: id,
                }, {
                    $set: {
                        'compliance_items.$[element].document_name': updatePayloadDto.file_name,
                        'compliance_items.$[element].original_filename': updatePayloadDto.original_filename,
                        'compliance_items.$[element].status': enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED,
                    },
                    $unset: {
                        'compliance_items.$[element].effective_date': '',
                        'compliance_items.$[element].expiry_date': '',
                    },
                }, {
                    arrayFilters: [
                        { 'element.document_type_uuid': document_type_uuid },
                    ],
                });
            }
            const res = await this.ComplianceModel.findOne(condition);
            return this.mapper.map(res, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async findOne(conditions) {
        try {
            const compliance = await this.ComplianceModel.findOne(conditions);
            return this.mapper.map(compliance, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.ComplianceModel.findById(id).lean();
            if (!res) {
                throw new apiError_1.ServiceError('Compliance not found', common_1.HttpStatus.BAD_REQUEST);
            }
            if (res.project_id) {
                const project = await this.projectService.getById(res.project_id);
                if (project) {
                    res.project = project;
                }
            }
            for (const template_item of res.template_items) {
                const masterRequirement = await this.masterRequirementModel
                    .findById(template_item.master_requirement_id)
                    .lean();
                template_item.master_requirement = masterRequirement;
            }
            for (const compliance_item of res.compliance_items) {
                const masterRequirement = await this.masterRequirementModel
                    .findById(new mongodb_1.ObjectId(compliance_item.master_requirement_id))
                    .lean();
                compliance_item.master_requirement = masterRequirement;
            }
            return this.mapper.map(res, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getComplianceForReview(client_id, project_id, vendor_id) {
        try {
            const res = await this.ComplianceModel.findOne({
                client_id: new mongodb_1.ObjectId(client_id),
                project_id: new mongodb_1.ObjectId(project_id),
                vendor_id: new mongodb_1.ObjectId(vendor_id),
                status: true,
            }).lean();
            if (!res) {
                throw new apiError_1.ServiceError('Compliance not found', common_1.HttpStatus.BAD_REQUEST);
            }
            for (const template_item of res.template_items) {
                const template = await this.template.findById(template_item.template_id);
                if (template) {
                    template_item.template_name = template.template_name;
                    if (template.rules.length > 0) {
                        for (const rule of template === null || template === void 0 ? void 0 : template.rules) {
                            if (rule._id.toString() ===
                                template_item.template_rule_id.toString()) {
                                template_item.rule_detail = rule;
                                const masterRequirement = await this.masterRequirementModel.findById(rule.master_requirement_id);
                                template_item.master_requirement = masterRequirement;
                            }
                        }
                    }
                }
            }
            for (const compliance_item of res.compliance_items) {
                const masterRequirement = await this.masterRequirementModel
                    .findById(new mongodb_1.ObjectId(compliance_item.master_requirement_id))
                    .lean();
                compliance_item.master_requirement = masterRequirement;
            }
            return this.mapper.map(res, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateByRequirementGroup(requirement_group_id, master_requirement_id, action) {
        try {
            if (action === enum_1.COMPLIANCE_UPDATE_TEMPLATES.REMOVED) {
                await this.ComplianceModel.updateMany({
                    requirement_group_id: new mongodb_1.ObjectId(requirement_group_id),
                    'compliance_items.master_requirement_id': new mongodb_1.ObjectId(master_requirement_id),
                }, {
                    $pull: {
                        compliance_items: {
                            master_requirement_id: new mongodb_1.ObjectId(master_requirement_id),
                        },
                    },
                });
            }
            if (action === enum_1.COMPLIANCE_UPDATE_TEMPLATES.ADDED) {
                const requirement = await this.masterRequirement.getById(master_requirement_id);
                if (!requirement) {
                    return;
                }
                await this.ComplianceModel.updateMany({
                    requirement_group_id: new mongodb_1.ObjectId(requirement_group_id),
                }, {
                    $push: {
                        compliance_items: Object.assign({ master_requirement_id: requirement._id, required_limit: requirement.requirement_rule, actual_limit: '', status: enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED, comment: requirement.default_comment, show: true, waiver: false, post_closing: false, document_name: '', document_type_uuid: requirement.document_type_uuid }, (requirement.OCR_KEY && {
                            OCR_KEY: requirement.OCR_KEY,
                        })),
                    },
                });
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateByTemplate(requirement_group_id, old_template_id, new_template_id) {
        var _a;
        try {
            const template_items = [];
            const compliances = await this.ComplianceModel.find(Object.assign({ requirement_group_id: new mongodb_1.ObjectId(requirement_group_id) }, (old_template_id && {
                'template_items.template_id': new mongodb_1.ObjectId(old_template_id),
            })));
            if (old_template_id) {
                await this.ComplianceModel.updateMany({
                    requirement_group_id: new mongodb_1.ObjectId(requirement_group_id),
                    'template_items.template_id': new mongodb_1.ObjectId(old_template_id),
                }, {
                    $pull: {
                        template_items: {
                            template_id: new mongodb_1.ObjectId(old_template_id),
                        },
                    },
                });
            }
            const template = await this.TemplateModel.aggregate([
                {
                    $match: {
                        _id: new mongodb_1.ObjectId(new_template_id),
                    },
                },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        localField: 'rules.master_requirement_id',
                        foreignField: '_id',
                        as: 'rule_requirement',
                    },
                },
                {
                    $addFields: {
                        rules: {
                            $map: {
                                input: '$rules',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            master_requirement_detail: {
                                                $arrayElemAt: [
                                                    '$rule_requirement',
                                                    {
                                                        $indexOfArray: [
                                                            '$rule_requirement._id',
                                                            '$$rel.master_requirement_id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            ]);
            if (template[0]) {
                (_a = template[0].rules) === null || _a === void 0 ? void 0 : _a.forEach((rule) => {
                    if (rule.is_enabled) {
                        template_items.push(Object.assign({ template_id: new mongodb_1.ObjectId(new_template_id), template_rule_id: rule._id, actual_limit: '', status: enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED, show: true, waiver: false, post_closing: false, document_name: '', original_filename: '', master_requirement_id: rule.master_requirement_detail._id, document_type_uuid: rule.master_requirement_detail.document_type_uuid }, (rule.master_requirement_detail.OCR_KEY && {
                            OCR_KEY: rule.master_requirement_detail.OCR_KEY,
                        })));
                    }
                });
            }
            await this.ComplianceModel.updateMany({
                _id: {
                    $in: compliances.map(compliance => new mongodb_1.ObjectId(compliance._id)),
                },
            }, {
                $push: {
                    template_items: { $each: template_items },
                },
            });
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateByTemplateEdit(template_id, rules_id, action) {
        var _a;
        try {
            if (action === enum_1.COMPLIANCE_UPDATE_TEMPLATES.REMOVED) {
                await this.ComplianceModel.updateMany({
                    'template_items.template_id': new mongodb_1.ObjectId(template_id),
                    'template_items.$.template_rule_id': {
                        $in: rules_id.map(rule => new mongodb_1.ObjectId(rule)),
                    },
                }, {
                    $pull: {
                        template_items: {
                            template_id: new mongodb_1.ObjectId(template_id),
                            template_rule_id: {
                                $in: rules_id.map(rule => new mongodb_1.ObjectId(rule)),
                            },
                        },
                    },
                });
            }
            if (action === enum_1.COMPLIANCE_UPDATE_TEMPLATES.ADDED) {
                const template_items = [];
                const compliances = await this.ComplianceModel.find({
                    'template_items.template_id': new mongodb_1.ObjectId(template_id),
                    'template_items.$.template_rule_id': {
                        $in: rules_id.map(rule => new mongodb_1.ObjectId(rule)),
                    },
                });
                const template = await this.TemplateModel.aggregate([
                    {
                        $match: {
                            _id: new mongodb_1.ObjectId(template_id),
                        },
                    },
                    {
                        $lookup: {
                            from: 'masterrequirementmodels',
                            localField: 'rules.master_requirement_id',
                            foreignField: '_id',
                            as: 'rule_requirement',
                        },
                    },
                    {
                        $addFields: {
                            rules: {
                                $map: {
                                    input: '$rules',
                                    as: 'rel',
                                    in: {
                                        $mergeObjects: [
                                            '$$rel',
                                            {
                                                master_requirement_detail: {
                                                    $arrayElemAt: [
                                                        '$rule_requirement',
                                                        {
                                                            $indexOfArray: [
                                                                '$rule_requirement._id',
                                                                '$$rel.master_requirement_id',
                                                            ],
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                ]);
                if (template[0]) {
                    (_a = template[0].rules) === null || _a === void 0 ? void 0 : _a.forEach((rule) => {
                        if (rules_id.some(ru => ru === rule._id.toString()) &&
                            rule.is_enabled) {
                            template_items.push(Object.assign({ template_id: new mongodb_1.ObjectId(template_id), template_rule_id: rule._id, actual_limit: '', status: enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED, show: true, waiver: false, post_closing: false, document_name: '', original_filename: '', master_requirement_id: rule.master_requirement_detail._id, document_type_uuid: rule.master_requirement_detail.document_type_uuid }, (rule.master_requirement_detail.OCR_KEY && {
                                OCR_KEY: rule.master_requirement_detail.OCR_KEY,
                            })));
                        }
                    });
                }
                await this.ComplianceModel.updateMany({
                    _id: {
                        $in: compliances.map(compliance => new mongodb_1.ObjectId(compliance._id)),
                    },
                    'template.$.template_id': new mongodb_1.ObjectId(template_id),
                }, {
                    $push: {
                        template_items: { $each: template_items },
                    },
                });
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateComplianceItem(id, complianceItemUpdateDto) {
        var _a;
        try {
            const queryConditions = {
                $and: [],
            };
            const payload = {};
            queryConditions.$and.push({ _id: id });
            if (complianceItemUpdateDto.compliance_item) {
                queryConditions.$and.push({
                    'compliance_items._id': complianceItemUpdateDto.compliance_item._id,
                });
                payload['compliance_items.$.show'] =
                    complianceItemUpdateDto.compliance_item.show;
                payload['compliance_items.$.status'] =
                    complianceItemUpdateDto.compliance_item.status;
                payload['compliance_items.$.waiver'] =
                    complianceItemUpdateDto.compliance_item.waiver;
                payload['compliance_items.$.post_closing'] =
                    complianceItemUpdateDto.compliance_item.post_closing;
                payload['compliance_items.$.comment'] =
                    complianceItemUpdateDto.compliance_item.comment;
                payload['compliance_items.$.actual_limit'] =
                    complianceItemUpdateDto.compliance_item.actual_limit;
            }
            if (complianceItemUpdateDto.template_item) {
                (_a = queryConditions.$and) === null || _a === void 0 ? void 0 : _a.push({
                    'template_items._id': complianceItemUpdateDto.template_item._id,
                });
                payload['template_items.$.show'] =
                    complianceItemUpdateDto.template_item.show;
                payload['template_items.$.status'] =
                    complianceItemUpdateDto.template_item.status;
                payload['template_items.$.waiver'] =
                    complianceItemUpdateDto.template_item.waiver;
                payload['template_items.$.post_closing'] =
                    complianceItemUpdateDto.template_item.post_closing;
                payload['template_items.$.comment'] =
                    complianceItemUpdateDto.template_item.comment;
                payload['template_items.$.actual_limit'] =
                    complianceItemUpdateDto.template_item.actual_limit;
            }
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
            const compliance = await this.ComplianceModel.findOneAndUpdate(queryConditions, {
                $set: payload,
            }, { new: true });
            return this.mapper.map(compliance, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateComplianceValue(OcrData) {
        var _a, _b;
        try {
            const res = await this.ComplianceModel.findById(OcrData.compliance_id);
            if (!res) {
                throw new apiError_1.ServiceError("Compliance with that id doesn't exist!", common_1.HttpStatus.BAD_REQUEST);
            }
            if (res.template_items.length > 0) {
                for (const template of res.template_items) {
                    if (template.OCR_KEY && template.OCR_KEY.length > 0) {
                        for (const key of template.OCR_KEY) {
                            if (OcrData.extracted_data.hasOwnProperty(key)) {
                                template.actual_limit = OcrData.extracted_data[key];
                            }
                        }
                    }
                    if (template.hasOwnProperty('policy_number')) {
                        template.policy_number =
                            (_a = OcrData.extracted_data['policy_number']) !== null && _a !== void 0 ? _a : '';
                    }
                    if (template.hasOwnProperty('named_insured')) {
                        template.named_insured =
                            (_b = OcrData.extracted_data['named_insured']) !== null && _b !== void 0 ? _b : '';
                    }
                }
            }
            if (res.compliance_items.length > 0) {
                for (const compliance of res.compliance_items) {
                    if (compliance.OCR_KEY &&
                        OcrData.extracted_data.hasOwnProperty(compliance.OCR_KEY[0])) {
                        compliance.actual_limit =
                            OcrData.extracted_data[compliance.OCR_KEY[0]];
                    }
                }
            }
            const data = await this.ComplianceModel.findByIdAndUpdate({ _id: OcrData.compliance_id }, {
                $set: {
                    compliance_items: res.compliance_items,
                    template_items: res.template_items,
                },
            }, {
                new: true,
            });
            return this.mapper.map(data, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateComplianceStatus(id) {
        try {
            const res = await this.ComplianceModel.aggregate([
                {
                    $match: { _id: new mongodb_1.ObjectId(id) },
                },
                {
                    $lookup: {
                        from: 'templatemodels',
                        let: { letId: '$template_items.template_id' },
                        pipeline: [
                            { $match: { $expr: { $in: ['$_id', '$$letId'] } } },
                            {
                                $project: {
                                    rules: 1,
                                },
                            },
                        ],
                        as: 'lookupRelations',
                    },
                },
                {
                    $addFields: {
                        template_items: {
                            $map: {
                                input: '$template_items',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            template_detail: {
                                                $arrayElemAt: [
                                                    '$lookupRelations',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations._id',
                                                            '$$rel.template_id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
            ]);
            if (res.length <= 0) {
                throw new apiError_1.ServiceError("Compliance with that id doesn't exist!", common_1.HttpStatus.BAD_REQUEST);
            }
            for (const template of res[0].template_items) {
                if (template.OCR_KEY && template.OCR_KEY.length > 0) {
                    const rule = template.template_detail.rules.find((rule) => rule._id.toString() === template.template_rule_id.toString());
                    const actual_limit = this.convertToNumber(template.actual_limit);
                    const value = this.convertToNumber(rule.value);
                    if (actual_limit && value) {
                        switch (rule.condition) {
                            case enum_1.TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN:
                                if (actual_limit > value) {
                                    template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                                }
                                else {
                                    template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                                }
                                break;
                            case enum_1.TEMPLATE_RULE_CONDITION_ENUM.GREATER_THAN_OR_EQUAL:
                                if (actual_limit >= value) {
                                    template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                                }
                                else {
                                    template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                                }
                                break;
                            case enum_1.TEMPLATE_RULE_CONDITION_ENUM.LESS_THAN:
                                if (actual_limit < value) {
                                    template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                                }
                                else {
                                    template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    if (rule.condition === enum_1.TEMPLATE_RULE_CONDITION_ENUM.REQUIRED) {
                        if (actual_limit) {
                            template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_GREEN;
                        }
                        else {
                            template.status = enum_1.COMPLIANCE_ITEM_STATUS_ENUM.STATUS_RED;
                        }
                    }
                    delete template.template_detail;
                }
            }
            const data = await this.ComplianceModel.findByIdAndUpdate({ _id: id }, {
                $set: {
                    template_items: res[0].template_items,
                },
            }, {
                new: true,
            });
            return this.mapper.map(data, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateComplianceOCRData(payload) {
        try {
            const update = {};
            if (payload.document_type === 'acord_28') {
                update['acord_28_ocr_data'] = payload;
            }
            else {
                update['acord_25_ocr_data'] = payload;
            }
            await this.ComplianceModel.findOneAndUpdate({ _id: payload.compliance_id }, {
                $set: update,
            }, { new: true });
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async updateDocumentDate(id, updateDocumentDto) {
        try {
            const compliance = await this.ComplianceModel.findOne({
                _id: id,
            });
            if (!compliance) {
                throw new apiError_1.ServiceError('Compliance not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            if (updateDocumentDto.item_type === 'compliance') {
                await this.ComplianceModel.updateMany({
                    _id: id,
                }, {
                    $set: Object.assign(Object.assign({}, (updateDocumentDto.effective_date && {
                        'compliance_items.$[element].effective_date': updateDocumentDto.effective_date,
                    })), (updateDocumentDto.expiry_date && {
                        'compliance_items.$[element].expiry_date': updateDocumentDto.expiry_date,
                    })),
                }, {
                    arrayFilters: [
                        {
                            'element.document_type_uuid': updateDocumentDto.document_type_uuid,
                        },
                    ],
                });
            }
            if (updateDocumentDto.item_type === 'template') {
                await this.ComplianceModel.updateMany({
                    _id: id,
                }, {
                    $set: Object.assign(Object.assign({}, (updateDocumentDto.effective_date && {
                        'template_items.$[element].effective_date': updateDocumentDto.effective_date,
                    })), (updateDocumentDto.expiry_date && {
                        'template_items.$[element].expiry_date': updateDocumentDto.expiry_date,
                    })),
                }, {
                    arrayFilters: [
                        {
                            'element.document_type_uuid': updateDocumentDto.document_type_uuid,
                        },
                    ],
                });
            }
            const res = await this.ComplianceModel.findById(id);
            return this.mapper.map(res, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async complianceByVendorAndProject(project_id, vendor_id) {
        try {
            let res = await this.ComplianceModel.findOne({
                project_id: new mongodb_1.ObjectId(project_id),
                vendor_id: new mongodb_1.ObjectId(vendor_id),
                status: true,
            }).lean();
            if (!res) {
                throw new apiError_1.ServiceError('Compliance not found', common_1.HttpStatus.BAD_REQUEST);
            }
            res = await this.getById(res._id);
            return this.mapper.map(res, compliance_model_1.ComplianceModel, Compliance_1.ComplianceCompleteResponsDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    convertToNumber(str) {
        try {
            return Number(str.replace(/[\s,]+/g, ''));
        }
        catch (e) { }
    }
};
ComplianceManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(requirements_model_1.RequirementsModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(document_upload_model_1.DocumentUploadModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __param(5, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __param(9, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof master_requirement_service_1.IMasterRequirementService !== "undefined" && master_requirement_service_1.IMasterRequirementService) === "function" ? _g : Object, typeof (_h = typeof document_upload_service_1.IDocumentUploadService !== "undefined" && document_upload_service_1.IDocumentUploadService) === "function" ? _h : Object, typeof (_j = typeof project_service_1.IProjectService !== "undefined" && project_service_1.IProjectService) === "function" ? _j : Object, typeof (_k = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _k : Object])
], ComplianceManagerService);
exports.ComplianceManagerService = ComplianceManagerService;


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IDocumentUploadService = void 0;
class IDocumentUploadService {
}
exports.IDocumentUploadService = IDocumentUploadService;


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IContactService = void 0;
class IContactService {
}
exports.IContactService = IContactService;


/***/ }),
/* 121 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const assign_project_model_1 = __webpack_require__(35);
const auto_notification_model_1 = __webpack_require__(108);
const client_model_1 = __webpack_require__(42);
const communication_model_1 = __webpack_require__(109);
const communication_template_model_1 = __webpack_require__(45);
const compliance_model_1 = __webpack_require__(62);
const contact_model_1 = __webpack_require__(49);
const document_upload_model_1 = __webpack_require__(81);
const escalation_model_1 = __webpack_require__(122);
const otp_model_1 = __webpack_require__(51);
const project_model_1 = __webpack_require__(27);
const coverage_type_model_1 = __webpack_require__(66);
const document_category_model_1 = __webpack_require__(70);
const document_type_model_1 = __webpack_require__(74);
const master_requirement_model_1 = __webpack_require__(33);
const requirements_model_1 = __webpack_require__(84);
const template_model_1 = __webpack_require__(34);
const tag_model_1 = __webpack_require__(123);
const user_model_1 = __webpack_require__(98);
const vendor_model_1 = __webpack_require__(82);
const databaseProviders = [
    mongoose_1.MongooseModule.forFeature([
        { name: user_model_1.UserModel.name, schema: user_model_1.UserModelSchema },
        { name: assign_project_model_1.AssignProjectModel.name, schema: assign_project_model_1.AssignProjectModelSchema },
        { name: client_model_1.ClientModel.name, schema: client_model_1.ClientModelSchema },
        { name: contact_model_1.ContactModel.name, schema: contact_model_1.ContactModelSchema },
        { name: vendor_model_1.VendorModel.name, schema: vendor_model_1.VendorModelSchema },
        { name: coverage_type_model_1.CoverageTypeModel.name, schema: coverage_type_model_1.CoverageTypeModelSchema },
        { name: document_category_model_1.DocumentCategoryModel.name, schema: document_category_model_1.DocumentCategoryModelSchema },
        { name: document_type_model_1.DocumentTypeModel.name, schema: document_type_model_1.DocumentTypeModelSchema },
        {
            name: master_requirement_model_1.MasterRequirementModel.name,
            schema: master_requirement_model_1.MasterRequirementModelSchema,
        },
        {
            name: requirements_model_1.RequirementsModel.name,
            schema: requirements_model_1.RequirementsModelSchema,
        },
        {
            name: template_model_1.TemplateModel.name,
            schema: template_model_1.TemplateModelSchema,
        },
        {
            name: compliance_model_1.ComplianceModel.name,
            schema: compliance_model_1.ComplianceModelSchema,
        },
        {
            name: project_model_1.ProjectModel.name,
            schema: project_model_1.ProjectModelSchema,
        },
        { name: otp_model_1.OTPModel.name, schema: otp_model_1.OTPModelSchema },
        { name: document_upload_model_1.DocumentUploadModel.name, schema: document_upload_model_1.DocumentUploadModelSchema },
        {
            name: communication_template_model_1.CommunicationTemplateModel.name,
            schema: communication_template_model_1.CommunicationTemplateModelSchema,
        },
        {
            name: auto_notification_model_1.AutoNotificationModel.name,
            schema: auto_notification_model_1.AutoNotificationModelSchema,
        },
        {
            name: tag_model_1.TagModel.name,
            schema: tag_model_1.TagModelSchema,
        },
        {
            name: communication_model_1.CommunicationModel.name,
            schema: communication_model_1.CommunicationModelSchema,
        },
        {
            name: escalation_model_1.EscalationModel.name,
            schema: escalation_model_1.EscalationModelSchema,
        },
    ]),
];
let DatabaseModule = class DatabaseModule {
};
DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [...databaseProviders],
        exports: [...databaseProviders],
    })
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;


/***/ }),
/* 122 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscalationModelSchema = exports.EscalationModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let EscalationModel = class EscalationModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], EscalationModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], EscalationModel.prototype, "compliance_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], EscalationModel.prototype, "project_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], EscalationModel.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, required: true }),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], EscalationModel.prototype, "user_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], EscalationModel.prototype, "date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], EscalationModel.prototype, "coverage_types", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], EscalationModel.prototype, "status", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], EscalationModel.prototype, "comments", void 0);
EscalationModel = __decorate([
    (0, mongoose_1.Schema)()
], EscalationModel);
exports.EscalationModel = EscalationModel;
exports.EscalationModelSchema = mongoose_1.SchemaFactory.createForClass(EscalationModel);


/***/ }),
/* 123 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagModelSchema = exports.TagModel = void 0;
const classes_1 = __webpack_require__(21);
const mongoose_1 = __webpack_require__(19);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let TagModel = class TagModel {
};
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], TagModel.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], TagModel.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: mongoose_2.SchemaTypes.ObjectId, default: null }),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], TagModel.prototype, "parent", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], TagModel.prototype, "count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], TagModel.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], TagModel.prototype, "children", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], TagModel.prototype, "vendor_count", void 0);
TagModel = __decorate([
    (0, mongoose_1.Schema)()
], TagModel);
exports.TagModel = TagModel;
exports.TagModelSchema = mongoose_1.SchemaFactory.createForClass(TagModel);


/***/ }),
/* 124 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentUploadManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const DocumentUpload_1 = __webpack_require__(125);
const DocumentUploadPartial_1 = __webpack_require__(126);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const bson_1 = __webpack_require__(127);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const compliance_model_1 = __webpack_require__(62);
const template_model_1 = __webpack_require__(34);
const vendor_model_1 = __webpack_require__(82);
const document_upload_model_1 = __webpack_require__(81);
let DocumentUploadManagerService = class DocumentUploadManagerService extends nestjs_1.AutomapperProfile {
    constructor(template, mapper, DocumentUploadModel, ComplianceModel, VendorModel) {
        super(mapper);
        this.template = template;
        this.mapper = mapper;
        this.DocumentUploadModel = DocumentUploadModel;
        this.ComplianceModel = ComplianceModel;
        this.VendorModel = VendorModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, document_upload_model_1.DocumentUploadModel, DocumentUpload_1.DocumentUploadCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.compliance, (0, core_1.mapFrom)(s => s.compliance_id)), (0, core_1.forMember)(d => d.created_at, (0, core_1.mapFrom)(s => s._id.getTimestamp())), (0, core_1.forMember)(d => d.item_id, (0, core_1.mapFrom)(s => s.item_id)), (0, core_1.forMember)(d => d.contact_id, (0, core_1.mapFrom)(s => s.contact_id)));
            (0, core_1.createMap)(mapper, document_upload_model_1.DocumentUploadModel, DocumentUploadPartial_1.DocumentUploadPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.compliance, (0, core_1.mapFrom)(s => s.compliance_id)), (0, core_1.forMember)(d => d.created_at, (0, core_1.mapFrom)(s => s._id.getTimestamp())), (0, core_1.forMember)(d => d.item_id, (0, core_1.mapFrom)(s => s.item_id)), (0, core_1.forMember)(d => d.contact_id, (0, core_1.mapFrom)(s => s.contact_id)), (0, core_1.forMember)(d => d.vendor, (0, core_1.mapFrom)(s => s.vendor)));
        };
    }
    async create(DocumentUploadPayloadDto) {
        var _a, _b;
        try {
            const item_id_array = [];
            const compliance = await this.ComplianceModel.findOne({
                _id: DocumentUploadPayloadDto.compliance_id,
            });
            if (compliance && DocumentUploadPayloadDto.item_type === 'compliance') {
                const item_data = compliance.compliance_items.find(item => item._id.toString() === DocumentUploadPayloadDto.item_id.toString());
                (_a = compliance.compliance_items) === null || _a === void 0 ? void 0 : _a.forEach(item => {
                    if (item.document_type_uuid === (item_data === null || item_data === void 0 ? void 0 : item_data.document_type_uuid)) {
                        item_id_array.push(item._id);
                    }
                });
            }
            else if (compliance &&
                DocumentUploadPayloadDto.item_type === 'template') {
                const item_data = compliance.template_items.find(item => item._id.toString() === DocumentUploadPayloadDto.item_id.toString());
                (_b = compliance.template_items) === null || _b === void 0 ? void 0 : _b.forEach(item => {
                    if (item.document_type_uuid === (item_data === null || item_data === void 0 ? void 0 : item_data.document_type_uuid)) {
                        item_id_array.push(item._id);
                    }
                });
            }
            const notication = await this.DocumentUploadModel.findOneAndUpdate({
                compliance_id: DocumentUploadPayloadDto.compliance_id,
                item_id: { $in: item_id_array },
                item_type: DocumentUploadPayloadDto.item_type,
                isDeleted: false,
            }, {
                $set: { is_read: false },
            });
            if (notication) {
                return this.mapper.map(notication, document_upload_model_1.DocumentUploadModel, DocumentUpload_1.DocumentUploadCompleteResponseDto);
            }
            else {
                const res = await this.DocumentUploadModel.create(DocumentUploadPayloadDto);
                return this.mapper.map(res, document_upload_model_1.DocumentUploadModel, DocumentUpload_1.DocumentUploadCompleteResponseDto);
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            await this.DocumentUploadModel.findByIdAndUpdate({
                _id: id,
            }, {
                is_read: true,
            });
            const res = await this.DocumentUploadModel.aggregate([
                {
                    $match: {
                        _id: new bson_1.ObjectID(id),
                    },
                },
                {
                    $lookup: {
                        from: 'compliancemodels',
                        localField: 'compliance_id',
                        foreignField: '_id',
                        as: 'compliance_id',
                    },
                },
                {
                    $unwind: {
                        path: '$compliance_id',
                    },
                },
                {
                    $lookup: {
                        from: 'contactmodels',
                        localField: 'contact_id',
                        foreignField: '_id',
                        as: 'contact_id',
                    },
                },
                {
                    $unwind: {
                        path: '$contact_id',
                    },
                },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        let: {
                            letId: '$compliance_id.compliance_items.master_requirement_id',
                        },
                        pipeline: [{ $match: { $expr: { $in: ['$_id', '$$letId'] } } }],
                        as: 'lookupRelations',
                    },
                },
                {
                    $addFields: {
                        'compliance_id.compliance_items': {
                            $map: {
                                input: '$compliance_id.compliance_items',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            master_requirement: {
                                                $arrayElemAt: [
                                                    '$lookupRelations',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations._id',
                                                            '$$rel.master_requirement_id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'masterrequirementmodels',
                        let: {
                            letId: '$compliance_id.template_items.master_requirement_id',
                        },
                        pipeline: [{ $match: { $expr: { $in: ['$_id', '$$letId'] } } }],
                        as: 'lookupRelations2',
                    },
                },
                {
                    $addFields: {
                        'compliance_id.template_items': {
                            $map: {
                                input: '$compliance_id.template_items',
                                as: 'rel',
                                in: {
                                    $mergeObjects: [
                                        '$$rel',
                                        {
                                            master_requirement: {
                                                $arrayElemAt: [
                                                    '$lookupRelations2',
                                                    {
                                                        $indexOfArray: [
                                                            '$lookupRelations2._id',
                                                            '$$rel.master_requirement_id',
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        lookupRelations: 0,
                        lookupRelations2: 0,
                    },
                },
            ]);
            if (!res || res.length < 1) {
                throw new apiError_1.ServiceError('Document not found', common_1.HttpStatus.NOT_FOUND);
            }
            const item = res[0].compliance_id.compliance_items.find((el) => el._id.toString() === res[0].item_id.toString());
            if (item) {
                res[0].compliance_id.compliance_items =
                    res[0].compliance_id.compliance_items.filter((el) => el.document_type_uuid === item.document_type_uuid);
            }
            else {
                res[0].compliance_id.compliance_items = [];
            }
            const item1 = res[0].compliance_id.template_items.find((el) => el._id.toString() === res[0].item_id.toString());
            if (item1) {
                res[0].compliance_id.template_items =
                    res[0].compliance_id.template_items.filter((el) => el.document_type_uuid === item1.document_type_uuid);
            }
            else {
                res[0].compliance_id.template_items = [];
            }
            const vendor = await this.VendorModel.findOne({
                _id: res[0].compliance_id.vendor_id,
            }).lean();
            for (const template_item of res[0].compliance_id.template_items) {
                const template = await this.template.findById(template_item.template_id);
                if (template) {
                    template_item.template_name = template.template_name;
                    if (template.rules.length > 0) {
                        for (const rule of template === null || template === void 0 ? void 0 : template.rules) {
                            if (rule._id.toString() ===
                                template_item.template_rule_id.toString()) {
                                template_item.rule_detail = rule;
                            }
                        }
                    }
                }
            }
            const mappedResponse = Object.assign(Object.assign({}, this.mapper.map(res[0], document_upload_model_1.DocumentUploadModel, DocumentUpload_1.DocumentUploadCompleteResponseDto)), { vendor: vendor });
            return mappedResponse;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.DocumentUploadModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, document_upload_model_1.DocumentUploadModel, DocumentUpload_1.DocumentUploadCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            const dropdownConditions = {};
            const searchQuery = [];
            const queryItems = {
                client_id: (query === null || query === void 0 ? void 0 : query.client_id) || null,
                project_id: (query === null || query === void 0 ? void 0 : query.project_id) || null,
                vendor_id: (query === null || query === void 0 ? void 0 : query.vendor_id) || null,
            };
            Object.keys(queryItems).forEach(key => {
                const fieldName = key.split('_')[0];
                queryItems[key]
                    ? (dropdownConditions[key] =
                        queryItems[key])
                    : searchQuery.push(`${fieldName}_name`);
            });
            Object.keys(queryItems).forEach(key => queryItems[key] === null &&
                delete queryItems[key]);
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, searchQuery);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            const compliances = await this.ComplianceModel.find({
                $and: [
                    queryConditions,
                    Object.assign({}, dropdownConditions),
                ],
            }).select('_id');
            const compliancesIds = compliances.map(compliance => compliance._id);
            const documentQuery = {
                $and: [],
            };
            documentQuery.$and.push({ compliance_id: { $in: compliancesIds } });
            if (query === null || query === void 0 ? void 0 : query.is_read) {
                documentQuery.$and.push({ is_read: JSON.parse(query.is_read) });
            }
            if ((query === null || query === void 0 ? void 0 : query.start_date) && (query === null || query === void 0 ? void 0 : query.end_date)) {
                const startDate = new Date(query.start_date).getTime();
                const endDate = new Date(query.end_date).getTime();
                documentQuery.$and.push({
                    _id: {
                        $gte: new mongodb_1.ObjectId(Math.floor(startDate / 1000).toString(16) + '0000000000000000'),
                        $lt: new mongodb_1.ObjectId(Math.floor(endDate / 1000).toString(16) + '0000000000000000'),
                    },
                });
            }
            documentQuery.$and.push({
                isDeleted: false,
            });
            const totalCount = await this.DocumentUploadModel.find(documentQuery).count();
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.DocumentUploadModel.aggregate([
                {
                    $match: documentQuery,
                },
                {
                    $lookup: {
                        from: 'compliancemodels',
                        localField: 'compliance_id',
                        foreignField: '_id',
                        as: 'compliance_id',
                    },
                },
                {
                    $lookup: {
                        from: 'vendormodels',
                        localField: 'compliance_id.vendor_id',
                        foreignField: '_id',
                        as: 'vendor',
                    },
                },
                {
                    $lookup: {
                        from: 'documenttypemodels',
                        localField: 'document_type_uuid',
                        foreignField: 'uuid',
                        as: 'document_type_data',
                    },
                },
                {
                    $unwind: {
                        path: '$compliance_id',
                    },
                },
                {
                    $unwind: {
                        path: '$vendor',
                    },
                },
                {
                    $unwind: {
                        path: '$document_type_data',
                    },
                },
                {
                    $addFields: {
                        document_type_name: '$document_type_data.name',
                    },
                },
                {
                    $sort: { _id: -1 },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: pagination.limit == 0
                        ? totalCount === 0
                            ? 10
                            : totalCount
                        : pagination.limit,
                },
            ]);
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount;
            const data = this.mapper.mapArray(res, document_upload_model_1.DocumentUploadModel, DocumentUploadPartial_1.DocumentUploadPartialResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount,
                total: totalCount,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async unreadCount() {
        try {
            const unreadCount = await this.DocumentUploadModel.find({
                is_read: false,
            }).count();
            return unreadCount;
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.DocumentUploadModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
DocumentUploadManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __param(1, (0, nestjs_1.InjectMapper)()),
    __param(2, (0, mongoose_1.InjectModel)(document_upload_model_1.DocumentUploadModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], DocumentUploadManagerService);
exports.DocumentUploadManagerService = DocumentUploadManagerService;


/***/ }),
/* 125 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentUploadDetailResponseDto = exports.DocumentUploadCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
class DocumentUploadCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentUploadCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], DocumentUploadCompleteResponseDto.prototype, "compliance", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['compliance', 'template'], {
        message: "item type must be of the following values ['compliance','template']",
    }),
    __metadata("design:type", String)
], DocumentUploadCompleteResponseDto.prototype, "item_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], DocumentUploadCompleteResponseDto.prototype, "item_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], DocumentUploadCompleteResponseDto.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DocumentUploadCompleteResponseDto.prototype, "is_read", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentUploadCompleteResponseDto.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentUploadCompleteResponseDto.prototype, "document_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], DocumentUploadCompleteResponseDto.prototype, "created_at", void 0);
exports.DocumentUploadCompleteResponseDto = DocumentUploadCompleteResponseDto;
class DocumentUploadDetailResponseDto extends DocumentUploadCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], DocumentUploadDetailResponseDto.prototype, "vendor", void 0);
exports.DocumentUploadDetailResponseDto = DocumentUploadDetailResponseDto;


/***/ }),
/* 126 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DocumentUploadPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const vendor_model_1 = __webpack_require__(82);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
class DocumentUploadPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], DocumentUploadPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", Object)
], DocumentUploadPartialResponseDto.prototype, "compliance", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['compliance', 'template'], {
        message: "item type must be of the following values ['compliance','template']",
    }),
    __metadata("design:type", String)
], DocumentUploadPartialResponseDto.prototype, "item_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], DocumentUploadPartialResponseDto.prototype, "item_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], DocumentUploadPartialResponseDto.prototype, "contact_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DocumentUploadPartialResponseDto.prototype, "is_read", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentUploadPartialResponseDto.prototype, "document_type_uuid", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DocumentUploadPartialResponseDto.prototype, "document_type_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], DocumentUploadPartialResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", typeof (_e = typeof vendor_model_1.VendorModel !== "undefined" && vendor_model_1.VendorModel) === "function" ? _e : Object)
], DocumentUploadPartialResponseDto.prototype, "vendor", void 0);
exports.DocumentUploadPartialResponseDto = DocumentUploadPartialResponseDto;


/***/ }),
/* 127 */
/***/ ((module) => {

module.exports = require("bson");

/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IEscalationService = void 0;
class IEscalationService {
}
exports.IEscalationService = IEscalationService;


/***/ }),
/* 129 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscalationManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const bullmq_1 = __webpack_require__(57);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const constants_1 = __webpack_require__(58);
const Escalation_1 = __webpack_require__(130);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const bullmq_2 = __webpack_require__(61);
const mongoose_2 = __webpack_require__(28);
const compliance_model_1 = __webpack_require__(62);
const escalation_model_1 = __webpack_require__(122);
let EscalationManagerService = class EscalationManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, EscalationModel, ComplianceModel, escalationQueue) {
        super(mapper);
        this.mapper = mapper;
        this.EscalationModel = EscalationModel;
        this.ComplianceModel = ComplianceModel;
        this.escalationQueue = escalationQueue;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, escalation_model_1.EscalationModel, Escalation_1.EscalationResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.coverage_types, (0, core_1.mapFrom)(s => s.coverage_types)));
        };
    }
    async create(createPayloadDto) {
        try {
            const res = await this.EscalationModel.create(createPayloadDto);
            const compliance = await this.ComplianceModel.findOneAndUpdate({
                _id: createPayloadDto.compliance_id,
            }, {
                $set: {
                    in_escalation: true,
                    escalation_id: res._id,
                },
            }, { new: true });
            if (!compliance) {
                throw new apiError_1.ServiceError('No compliance found', common_1.HttpStatus.NOT_FOUND);
            }
            return this.mapper.map(res, escalation_model_1.EscalationModel, Escalation_1.EscalationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.EscalationModel.findById(id);
            return this.mapper.map(res, escalation_model_1.EscalationModel, Escalation_1.EscalationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getByComplianceId(id) {
        try {
            const res = await this.EscalationModel.findOne({
                compliance_id: id,
            });
            return this.mapper.map(res, escalation_model_1.EscalationModel, Escalation_1.EscalationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, updatePayloadDto) {
        try {
            const res = await this.EscalationModel.findOneAndUpdate({
                _id: id,
            }, updatePayloadDto, { new: true, overwrite: false });
            return this.mapper.map(res, escalation_model_1.EscalationModel, Escalation_1.EscalationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async toggleEscalation(id) {
        try {
            const escalation = await this.getById(id);
            if (!escalation) {
                throw new apiError_1.ServiceError('Escalation not found', common_1.HttpStatus.NOT_FOUND);
            }
            const compliance = await this.ComplianceModel.findOneAndUpdate({
                escalation_id: id,
            }, {
                $set: {
                    in_escalation: !escalation.status,
                },
            }, { new: true });
            if (!compliance) {
                throw new apiError_1.ServiceError('No compliance found', common_1.HttpStatus.NOT_FOUND);
            }
            const res = await this.EscalationModel.findOneAndUpdate({
                _id: id,
            }, {
                $set: {
                    status: !escalation.status,
                },
            }, { new: true });
            return this.mapper.map(res, escalation_model_1.EscalationModel, Escalation_1.EscalationResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async sendEscalationEmail() {
        try {
            const res = await this.EscalationModel.find({
                status: true,
                date: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            });
            if (res.length > 0) {
                await this.escalationQueue.add(constants_1.ESCALATION_QUEUE, res);
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
EscalationManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(escalation_model_1.EscalationModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(3, (0, bullmq_1.InjectQueue)(constants_1.ESCALATION_QUEUE)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _d : Object])
], EscalationManagerService);
exports.EscalationManagerService = EscalationManagerService;


/***/ }),
/* 130 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EscalationResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
class EscalationResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], EscalationResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_b = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _b : Object)
], EscalationResponseDto.prototype, "compliance_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_c = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _c : Object)
], EscalationResponseDto.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_d = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _d : Object)
], EscalationResponseDto.prototype, "client_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", typeof (_e = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _e : Object)
], EscalationResponseDto.prototype, "user_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], EscalationResponseDto.prototype, "coverage_types", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], EscalationResponseDto.prototype, "date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EscalationResponseDto.prototype, "comments", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], EscalationResponseDto.prototype, "status", void 0);
exports.EscalationResponseDto = EscalationResponseDto;


/***/ }),
/* 131 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const GetAllDocuments_1 = __webpack_require__(132);
const GetDocuments_1 = __webpack_require__(133);
const errorHandler_1 = __webpack_require__(32);
const queryParams_1 = __webpack_require__(40);
const lodash_1 = __webpack_require__(41);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const compliance_model_1 = __webpack_require__(62);
const compliance_service_1 = __webpack_require__(55);
const document_upload_model_1 = __webpack_require__(81);
const document_type_model_1 = __webpack_require__(74);
let FileManagerService = class FileManagerService extends nestjs_1.AutomapperProfile {
    constructor(documentUploadModel, documentTypeModel, complianceModel, mapper, ComplianceService) {
        super(mapper);
        this.documentUploadModel = documentUploadModel;
        this.documentTypeModel = documentTypeModel;
        this.complianceModel = complianceModel;
        this.mapper = mapper;
        this.ComplianceService = ComplianceService;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, document_upload_model_1.DocumentUploadModel, GetDocuments_1.GetDocumentsCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.uploaded_at, (0, core_1.mapFrom)(s => s._id.getTimestamp())));
            (0, core_1.createMap)(mapper, GetDocuments_1.GetDocumentsCompleteResponseDto, GetAllDocuments_1.GetAllDocumentsResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.document_type_uuid, (0, core_1.mapFrom)(s => s.document_type_uuid)), (0, core_1.forMember)(d => d.count, (0, core_1.mapFrom)(s => s.count)));
        };
    }
    async getAll(query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)({ limit: query.limit, page: query.page, keyword: query.keyword }, ['_id']);
                pagination = paginationData;
                if (query.doc_type_uuid && query.doc_type_uuid.length) {
                    queryConditions.$or = [
                        { document_type_uuid: query.doc_type_uuid.trim() },
                    ];
                }
                else {
                    queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
                }
            }
            const countByUUID = await this.getDocumentCountByUUID();
            const totalCount = countByUUID.length <= 0 ? [{ count: 0 }] : countByUUID;
            const skip = pagination.limit * (pagination.page - 1);
            let res;
            if ((query === null || query === void 0 ? void 0 : query.client_id) || (query === null || query === void 0 ? void 0 : query.vendor_id)) {
                const pipeline = this.groupByDocumentName(query);
                pipeline.push({ $match: queryConditions }, {
                    $sort: {
                        _id: 1,
                    },
                }, {
                    $skip: skip,
                }, {
                    $limit: pagination.limit == 0
                        ? totalCount[0].count === 0
                            ? 10
                            : totalCount[0].count
                        : pagination.limit,
                });
                res = await this.documentUploadModel.aggregate(pipeline);
            }
            else {
                res = await this.documentTypeModel.aggregate([
                    {
                        $group: {
                            _id: '$name',
                            document_type_uuid: { $first: '$uuid' },
                        },
                    },
                    {
                        $addFields: {
                            count: 0,
                        },
                    },
                    { $match: queryConditions },
                    {
                        $sort: {
                            _id: 1,
                        },
                    },
                    {
                        $skip: skip,
                    },
                    {
                        $limit: pagination.limit == 0
                            ? totalCount[0].count === 0
                                ? 10
                                : totalCount[0].count
                            : pagination.limit,
                    },
                ]);
                const pipeline = this.groupByDocumentName(query);
                const uploadedDocument = await this.documentUploadModel.aggregate(pipeline);
                if (uploadedDocument.length > 0) {
                    res.forEach(el => {
                        const matchingDoc = uploadedDocument.find(el2 => (el === null || el === void 0 ? void 0 : el.document_type_uuid) === (el2 === null || el2 === void 0 ? void 0 : el2.document_type_uuid));
                        if (matchingDoc) {
                            el.count = matchingDoc.count;
                        }
                    });
                }
            }
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount[0].count;
            const data = this.mapper.mapArray(res, GetDocuments_1.GetDocumentsCompleteResponseDto, GetAllDocuments_1.GetAllDocumentsResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount[0].count,
                total: totalCount[0].count,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getDocuments(uuid, query) {
        try {
            const queryConditions = {};
            let pagination = {
                page: 1,
                limit: 0,
            };
            if (!(0, lodash_1.isEmpty)(query)) {
                const { conditions, pagination: paginationData } = (0, queryParams_1.createQueryparams)(query, ['original_filename', 'project_name', 'company_name', 'address']);
                pagination = paginationData;
                queryConditions.$or = (0, queryParams_1.getQueryConditions)(conditions);
            }
            let totalCount = await this.documentUploadModel.aggregate([
                {
                    $match: {
                        document_type_uuid: uuid,
                    },
                },
                {
                    $group: {
                        _id: '$item_id',
                    },
                },
                {
                    $count: 'count',
                },
            ]);
            totalCount = totalCount.length <= 0 ? [{ count: 0 }] : totalCount;
            const skip = pagination.limit * (pagination.page - 1);
            const res = await this.documentUploadModel.aggregate([
                {
                    $match: {
                        document_type_uuid: uuid,
                    },
                },
                {
                    $lookup: {
                        from: 'compliancemodels',
                        let: { compliance_id: '$compliance_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', ['$$compliance_id']],
                                    },
                                },
                            },
                            {
                                $project: {
                                    compliance_items: 1,
                                    template_items: 1,
                                    vendor_id: 1,
                                    vendor_name: 1,
                                    project_id: 1,
                                    project_name: 1,
                                },
                            },
                        ],
                        as: 'compliance_data',
                    },
                },
                {
                    $unwind: {
                        path: '$compliance_data',
                    },
                },
                {
                    $lookup: {
                        from: 'documenttypemodels',
                        localField: 'document_type_uuid',
                        foreignField: 'uuid',
                        as: 'document_type_detail',
                    },
                },
                {
                    $unwind: {
                        path: '$document_type_detail',
                    },
                },
                {
                    $addFields: {
                        vendor_id: '$compliance_data.vendor_id',
                        vendor_name: '$compliance_data.vendor_name',
                        project_name: '$compliance_data.project_name',
                        compliance_items: '$compliance_data.compliance_items',
                        template_items: '$compliance_data.template_items',
                        name: '$document_type_detail.name',
                    },
                },
                {
                    $lookup: {
                        from: 'vendormodels',
                        localField: 'vendor_id',
                        foreignField: '_id',
                        as: 'vendor_detail',
                    },
                },
                {
                    $unwind: {
                        path: '$vendor_detail',
                    },
                },
                {
                    $addFields: {
                        template_items: {
                            $filter: {
                                input: '$template_items',
                                as: 'obj',
                                cond: {
                                    $eq: ['$$obj._id', '$item_id'],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        compliance_items: {
                            $filter: {
                                input: '$compliance_items',
                                as: 'obj',
                                cond: {
                                    $eq: ['$$obj._id', '$item_id'],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        compliance_items: {
                            $cond: {
                                if: { $ne: ['$item_type', 'compliance'] },
                                then: '$$REMOVE',
                                else: {
                                    $arrayElemAt: ['$compliance_items', 0],
                                },
                            },
                        },
                        template_items: {
                            $cond: {
                                if: { $ne: ['$item_type', 'compliance'] },
                                then: {
                                    $arrayElemAt: ['$template_items', 0],
                                },
                                else: '$$REMOVE',
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        original_filename: {
                            $ifNull: [
                                '$compliance_items.original_filename',
                                '$template_items.original_filename',
                            ],
                        },
                        document_name: {
                            $ifNull: [
                                '$compliance_items.document_name',
                                '$template_items.document_name',
                            ],
                        },
                        document_type_uuid: {
                            $ifNull: [
                                '$compliance_items.document_type_uuid',
                                '$template_items.document_type_uuid',
                            ],
                        },
                        company_name: {
                            $ifNull: ['$vendor_detail.vendor_name', ''],
                        },
                        address: {
                            $ifNull: ['$vendor_detail.address_1', ''],
                        },
                        expiry_date: {
                            $ifNull: ['$compliance_items.expiry_date', ''],
                        },
                        effective_date: {
                            $ifNull: ['$compliance_items.effective_date', ''],
                        },
                    },
                },
                {
                    $project: {
                        compliance_data: 0,
                        template_items: 0,
                        compliance_items: 0,
                        vendor_detail: 0,
                        document_type_detail: 0,
                        __v: 0,
                    },
                },
                {
                    $match: queryConditions,
                },
                {
                    $sort: {
                        original_filename: 1,
                        document_name: 1,
                        company_name: 1,
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: pagination.limit == 0
                        ? totalCount[0].count === 0
                            ? 10
                            : totalCount[0].count
                        : pagination.limit,
                },
            ]);
            const page = pagination.page;
            const perPage = pagination.limit !== 0 ? pagination.limit : totalCount[0].count;
            const data = this.mapper.mapArray(res, document_upload_model_1.DocumentUploadModel, GetDocuments_1.GetDocumentsCompleteResponseDto);
            return {
                page,
                perPage: perPage ? perPage : totalCount[0].count,
                total: totalCount[0].count,
                data,
            };
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async editName(updateNameDto) {
        try {
            if (updateNameDto.item_type === 'compliance') {
                await this.complianceModel.updateMany({
                    _id: updateNameDto.compliance_id,
                }, {
                    $set: {
                        'compliance_items.$[element].original_filename': updateNameDto.original_filename,
                    },
                }, {
                    arrayFilters: [
                        {
                            'element.document_type_uuid': updateNameDto.document_type_uuid,
                        },
                    ],
                });
            }
            else {
                await this.complianceModel.updateMany({
                    _id: updateNameDto.compliance_id,
                }, {
                    $set: {
                        'template_items.$[element].original_filename': updateNameDto.original_filename,
                    },
                }, {
                    arrayFilters: [
                        {
                            'element.document_type_uuid': updateNameDto.document_type_uuid,
                        },
                    ],
                });
            }
            return 'file name successfully';
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getDocumentCountByUUID() {
        const countByUUID = await this.documentTypeModel.aggregate([
            {
                $group: {
                    _id: '$uuid',
                },
            },
            {
                $count: 'count',
            },
        ]);
        return countByUUID;
    }
    async complianceDocumentDetail(complianceDocumentListDto) {
        try {
            const compliance = await this.ComplianceService.complianceByVendorAndProject(complianceDocumentListDto.project_id, complianceDocumentListDto.vendor_id);
            const res = await this.documentUploadModel.aggregate([
                {
                    $match: {
                        compliance_id: new mongodb_1.ObjectId(compliance._id),
                    },
                },
                {
                    $lookup: {
                        from: 'compliancemodels',
                        let: { compliance_id: '$compliance_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', ['$$compliance_id']],
                                    },
                                },
                            },
                            {
                                $project: {
                                    compliance_items: 1,
                                    template_items: 1,
                                    vendor_id: 1,
                                    vendor_name: 1,
                                    project_id: 1,
                                    project_name: 1,
                                },
                            },
                        ],
                        as: 'compliance_data',
                    },
                },
                {
                    $unwind: {
                        path: '$compliance_data',
                    },
                },
                {
                    $lookup: {
                        from: 'documenttypemodels',
                        localField: 'document_type_uuid',
                        foreignField: 'uuid',
                        as: 'document_type_detail',
                    },
                },
                {
                    $unwind: {
                        path: '$document_type_detail',
                    },
                },
                {
                    $addFields: {
                        vendor_id: '$compliance_data.vendor_id',
                        vendor_name: '$compliance_data.vendor_name',
                        project_name: '$compliance_data.project_name',
                        compliance_items: '$compliance_data.compliance_items',
                        template_items: '$compliance_data.template_items',
                        name: '$document_type_detail.name',
                    },
                },
                {
                    $lookup: {
                        from: 'vendormodels',
                        localField: 'vendor_id',
                        foreignField: '_id',
                        as: 'vendor_detail',
                    },
                },
                {
                    $unwind: {
                        path: '$vendor_detail',
                    },
                },
                {
                    $addFields: {
                        template_items: {
                            $filter: {
                                input: '$template_items',
                                as: 'obj',
                                cond: {
                                    $eq: ['$$obj._id', '$item_id'],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        compliance_items: {
                            $filter: {
                                input: '$compliance_items',
                                as: 'obj',
                                cond: {
                                    $eq: ['$$obj._id', '$item_id'],
                                },
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        compliance_items: {
                            $cond: {
                                if: { $ne: ['$item_type', 'compliance'] },
                                then: '$$REMOVE',
                                else: {
                                    $arrayElemAt: ['$compliance_items', 0],
                                },
                            },
                        },
                        template_items: {
                            $cond: {
                                if: { $ne: ['$item_type', 'compliance'] },
                                then: {
                                    $arrayElemAt: ['$template_items', 0],
                                },
                                else: '$$REMOVE',
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        original_filename: {
                            $ifNull: [
                                '$compliance_items.original_filename',
                                '$template_items.original_filename',
                            ],
                        },
                        document_name: {
                            $ifNull: [
                                '$compliance_items.document_name',
                                '$template_items.document_name',
                            ],
                        },
                        document_type_uuid: {
                            $ifNull: [
                                '$compliance_items.document_type_uuid',
                                '$template_items.document_type_uuid',
                            ],
                        },
                        company_name: {
                            $ifNull: ['$vendor_detail.vendor_name', ''],
                        },
                        address: {
                            $ifNull: ['$vendor_detail.address_1', ''],
                        },
                        expiry_date: {
                            $ifNull: ['$compliance_items.expiry_date', ''],
                        },
                        effective_date: {
                            $ifNull: ['$compliance_items.effective_date', ''],
                        },
                    },
                },
                {
                    $project: {
                        compliance_data: 0,
                        template_items: 0,
                        compliance_items: 0,
                        vendor_detail: 0,
                        document_type_detail: 0,
                        __v: 0,
                    },
                },
                {
                    $sort: {
                        original_filename: 1,
                        document_name: 1,
                        company_name: 1,
                    },
                },
            ]);
            return this.mapper.mapArray(res, document_upload_model_1.DocumentUploadModel, GetDocuments_1.GetDocumentsCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    groupByDocumentName(query) {
        const pipeline = [
            {
                $lookup: {
                    from: 'documenttypemodels',
                    localField: 'document_type_uuid',
                    foreignField: 'uuid',
                    as: 'document_type_detail',
                },
            },
            {
                $lookup: {
                    from: 'compliancemodels',
                    let: {
                        compliance_id: '$compliance_id',
                        vendor_id: (query === null || query === void 0 ? void 0 : query.vendor_id)
                            ? new mongoose_2.default.Types.ObjectId(query === null || query === void 0 ? void 0 : query.vendor_id)
                            : undefined,
                        client_id: (query === null || query === void 0 ? void 0 : query.client_id)
                            ? new mongoose_2.default.Types.ObjectId(query === null || query === void 0 ? void 0 : query.client_id)
                            : undefined,
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$compliance_id'] },
                                        {
                                            $cond: {
                                                if: { $ne: ['$$vendor_id', undefined] },
                                                then: { $eq: ['$vendor_id', '$$vendor_id'] },
                                                else: true,
                                            },
                                        },
                                        {
                                            $cond: {
                                                if: { $ne: ['$$client_id', undefined] },
                                                then: { $eq: ['$client_id', '$$client_id'] },
                                                else: true,
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'compliance_detail',
                },
            },
            {
                $unwind: {
                    path: '$compliance_detail',
                },
            },
            {
                $addFields: {
                    compliance_items: {
                        $filter: {
                            input: '$compliance_detail.compliance_items',
                            as: 'obj',
                            cond: {
                                $eq: ['$$obj._id', '$item_id'],
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    template_items: {
                        $filter: {
                            input: '$compliance_detail.template_items',
                            as: 'obj',
                            cond: {
                                $eq: ['$$obj._id', '$item_id'],
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    compliance_items: {
                        $cond: {
                            if: { $ne: ['$item_type', 'compliance'] },
                            then: '$$REMOVE',
                            else: {
                                $arrayElemAt: ['$compliance_items', 0],
                            },
                        },
                    },
                    template_items: {
                        $cond: {
                            if: { $ne: ['$item_type', 'compliance'] },
                            then: {
                                $arrayElemAt: ['$template_items', 0],
                            },
                            else: '$$REMOVE',
                        },
                    },
                },
            },
            {
                $addFields: {
                    expiry_date: {
                        $ifNull: [
                            '$compliance_items.expiry_date',
                            '$template_items.expiry_date',
                        ],
                    },
                },
            },
            {
                $unwind: {
                    path: '$document_type_detail',
                },
            },
            {
                $group: {
                    _id: '$document_type_detail.name',
                    document_type_uuid: { $first: '$document_type_uuid' },
                    count: { $sum: 1 },
                },
            },
        ];
        return pipeline;
    }
};
FileManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_upload_model_1.DocumentUploadModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(document_type_model_1.DocumentTypeModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(3, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _d : Object, typeof (_e = typeof compliance_service_1.IComplianceService !== "undefined" && compliance_service_1.IComplianceService) === "function" ? _e : Object])
], FileManagerService);
exports.FileManagerService = FileManagerService;


/***/ }),
/* 132 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetAllDocumentsResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(24);
const GetDocuments_1 = __webpack_require__(133);
class GetAllDocumentsResponseDto extends (0, swagger_1.PickType)(GetDocuments_1.GetDocumentsCompleteResponseDto, ['_id', 'document_type_uuid']) {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetAllDocumentsResponseDto.prototype, "count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetAllDocumentsResponseDto.prototype, "expiry_date", void 0);
exports.GetAllDocumentsResponseDto = GetAllDocumentsResponseDto;


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDocumentsCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const swagger_1 = __webpack_require__(3);
const class_validator_1 = __webpack_require__(24);
const DocumentUpload_1 = __webpack_require__(125);
class GetDocumentsCompleteResponseDto extends (0, swagger_1.OmitType)(DocumentUpload_1.DocumentUploadCompleteResponseDto, ['compliance']) {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "original_filename", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "document_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "company_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetDocumentsCompleteResponseDto.prototype, "count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "expiry_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "address", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "project_name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetDocumentsCompleteResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], GetDocumentsCompleteResponseDto.prototype, "effective_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], GetDocumentsCompleteResponseDto.prototype, "uploaded_at", void 0);
exports.GetDocumentsCompleteResponseDto = GetDocumentsCompleteResponseDto;


/***/ }),
/* 134 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IFileManagerService = void 0;
class IFileManagerService {
}
exports.IFileManagerService = IFileManagerService;


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IOtpService = void 0;
class IOtpService {
}
exports.IOtpService = IOtpService;


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICoverageTypeService = void 0;
class ICoverageTypeService {
}
exports.ICoverageTypeService = ICoverageTypeService;


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IDocumentCategoryService = void 0;
class IDocumentCategoryService {
}
exports.IDocumentCategoryService = IDocumentCategoryService;


/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IDocumentTypeService = void 0;
class IDocumentTypeService {
}
exports.IDocumentTypeService = IDocumentTypeService;


/***/ }),
/* 139 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IRequirementService = void 0;
class IRequirementService {
}
exports.IRequirementService = IRequirementService;


/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITagService = void 0;
class ITagService {
}
exports.ITagService = ITagService;


/***/ }),
/* 141 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagManagerService = void 0;
const core_1 = __webpack_require__(17);
const nestjs_1 = __webpack_require__(18);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const Tag_1 = __webpack_require__(142);
const TagPartial_1 = __webpack_require__(143);
const apiError_1 = __webpack_require__(31);
const errorHandler_1 = __webpack_require__(32);
const helper_1 = __webpack_require__(144);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
const vendor_model_1 = __webpack_require__(82);
const tag_model_1 = __webpack_require__(123);
let TagManagerService = class TagManagerService extends nestjs_1.AutomapperProfile {
    constructor(mapper, tagModel, VendorModel) {
        super(mapper);
        this.mapper = mapper;
        this.tagModel = tagModel;
        this.VendorModel = VendorModel;
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, tag_model_1.TagModel, Tag_1.TagCompleteResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.children, (0, core_1.mapFrom)(s => s.children)), (0, core_1.forMember)(d => d.parent, (0, core_1.mapFrom)(s => s.parent)));
            (0, core_1.createMap)(mapper, tag_model_1.TagModel, TagPartial_1.TagPartialResponseDto, (0, core_1.forMember)(d => d._id, (0, core_1.mapFrom)(s => s._id)), (0, core_1.forMember)(d => d.children, (0, core_1.mapFrom)(s => s.children)), (0, core_1.forMember)(d => d.parent, (0, core_1.mapFrom)(s => s.parent)));
        };
    }
    async create(tagCreatorPayload) {
        try {
            if (tagCreatorPayload.parent) {
                const parent = await this.tagModel.findOne({
                    _id: tagCreatorPayload.parent,
                });
                if (!parent) {
                    common_1.Logger.warn(`PARENT TAG WITH ID ${tagCreatorPayload.parent} NOT FOUND`);
                    throw new apiError_1.ServiceError('Parent tag not found!', common_1.HttpStatus.NOT_FOUND);
                }
            }
            const existingTag = await this.tagModel.findOne({
                name: tagCreatorPayload.name,
                active: true,
            });
            if (existingTag) {
                common_1.Logger.warn(`TAG WITH NAME ${tagCreatorPayload.name} ALREADY EXISTS`);
                throw new apiError_1.ServiceError('Tag name must be unique!', common_1.HttpStatus.BAD_REQUEST);
            }
            if (tagCreatorPayload.parent) {
                const result = await this.getAncestors(tagCreatorPayload.parent);
                if (result.length >= 5) {
                    throw new apiError_1.ServiceError("Can't create tag maximum level reached!", common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const res = await this.tagModel.create(tagCreatorPayload);
            common_1.Logger.warn('[-] TAG CREATED SUCCESSFULLY');
            return this.mapper.map(res, tag_model_1.TagModel, Tag_1.TagCompleteResponseDto);
        }
        catch (error) {
            common_1.Logger.error(`Error while creating Tags, ${error.message}`);
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async update(id, editTagPayload) {
        try {
            if (editTagPayload.parent) {
                const ancestors = await this.getAncestors(editTagPayload.parent);
                const data = await this.tagModel.find({
                    active: true,
                });
                const descendants = (0, helper_1.findDescendants)(data, new mongodb_1.ObjectId(id));
                const level = ancestors.length + descendants.length + 1;
                if (level > 5) {
                    throw new apiError_1.ServiceError("Can't update tag maximum level reached!", common_1.HttpStatus.BAD_REQUEST);
                }
            }
            const res = await this.tagModel.findByIdAndUpdate({ _id: id }, {
                $set: editTagPayload,
            }, {
                new: true,
            });
            return this.mapper.map(res, tag_model_1.TagModel, Tag_1.TagCompleteResponseDto);
        }
        catch (error) {
            common_1.Logger.error(`Error while updating Tags, ${error.message}`);
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAll() {
        try {
            const response = await this.tagModel
                .find({ active: true })
                .sort({ _id: -1 })
                .lean();
            const tags = [];
            for (const tag of response) {
                const vendors = await this.VendorModel.find({ tags: tag._id }).lean();
                tags.push(Object.assign(Object.assign({}, tag), { vendor_count: vendors.length }));
            }
            let res = JSON.parse(JSON.stringify(tags));
            res = (0, helper_1.buildTree)(res);
            common_1.Logger.warn('[-] GET ALL TAGS');
            return this.mapper.mapArray(res, tag_model_1.TagModel, Tag_1.TagCompleteResponseDto);
        }
        catch (error) {
            common_1.Logger.error(`Error while getting Tags, ${error.message}`);
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async delete(id) {
        try {
            const tag = await this.tagModel.findOne({ _id: id });
            if (!tag) {
                common_1.Logger.warn(`[-] TAG WITH ID ${id} NOT FOUND`);
                throw new apiError_1.ServiceError('Tag not found!', common_1.HttpStatus.BAD_REQUEST);
            }
            const data = await this.tagModel.find({
                active: true,
            });
            const tagsToDel = (0, helper_1.findDescendants)(data, tag._id);
            tagsToDel.push(tag._id);
            await this.tagModel.updateMany({ _id: { $in: tagsToDel } }, {
                $set: { active: false },
            }, {
                new: true,
            });
            common_1.Logger.warn('[-] TAG DELETED SUCCESSFULLY');
            return common_1.HttpStatus.NO_CONTENT;
        }
        catch (error) {
            common_1.Logger.error(`Error while deleting Tags, ${error.message}`);
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getById(id) {
        try {
            const res = await this.tagModel.findById(id);
            common_1.Logger.warn('[-] GET TAG BY ID');
            return this.mapper.map(res, tag_model_1.TagModel, Tag_1.TagCompleteResponseDto);
        }
        catch (error) {
            common_1.Logger.error(`Error while getting Tag, ${error.message}`);
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async deleteAll() {
        try {
            await this.tagModel.deleteMany();
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async findAll() {
        try {
            const data = await this.tagModel.find({ active: true });
            return this.mapper.mapArray(data, tag_model_1.TagModel, Tag_1.TagCompleteResponseDto);
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
    async getAncestors(_id) {
        const result = [];
        const document = await this.tagModel.findById(_id);
        if (document && document.parent) {
            result.push(document.parent);
            const ancestors = await this.getAncestors(document.parent);
            result.push(...ancestors);
        }
        return result;
    }
};
TagManagerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __param(1, (0, mongoose_1.InjectModel)(tag_model_1.TagModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Mapper !== "undefined" && core_1.Mapper) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], TagManagerService);
exports.TagManagerService = TagManagerService;


/***/ }),
/* 142 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagCompleteResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class TagCompleteResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], TagCompleteResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], TagCompleteResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], TagCompleteResponseDto.prototype, "parent", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], TagCompleteResponseDto.prototype, "count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], TagCompleteResponseDto.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], TagCompleteResponseDto.prototype, "vendor_count", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], TagCompleteResponseDto.prototype, "children", void 0);
exports.TagCompleteResponseDto = TagCompleteResponseDto;


/***/ }),
/* 143 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagPartialResponseDto = void 0;
const classes_1 = __webpack_require__(21);
const mongodb_1 = __webpack_require__(25);
class TagPartialResponseDto {
}
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], TagPartialResponseDto.prototype, "_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], TagPartialResponseDto.prototype, "name", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Object)
], TagPartialResponseDto.prototype, "parent", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], TagPartialResponseDto.prototype, "active", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Array)
], TagPartialResponseDto.prototype, "children", void 0);
exports.TagPartialResponseDto = TagPartialResponseDto;


/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findDescendants = exports.buildTree = void 0;
function buildTree(items, parentId = null, level = 1, maxLevel = 6) {
    const result = [];
    if (level > maxLevel) {
        return result;
    }
    for (const item of items.filter(i => i.parent === parentId)) {
        const children = buildTree(items, item._id, level + 1, maxLevel);
        if (children.length > 0) {
            item.children = children;
        }
        result.push(item);
    }
    return result;
}
exports.buildTree = buildTree;
function findDescendants(data, _id) {
    const descendants = [];
    for (const obj of data) {
        if ((obj.parent ? obj.parent.toString() : '') === _id.toString()) {
            descendants.push(obj['_id']);
            descendants.push(...findDescendants(data, obj['_id']));
        }
    }
    return descendants;
}
exports.findDescendants = findDescendants;


/***/ }),
/* 145 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IUploadService = void 0;
class IUploadService {
}
exports.IUploadService = IUploadService;


/***/ }),
/* 146 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IUserService = void 0;
class IUserService {
}
exports.IUserService = IUserService;


/***/ }),
/* 147 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthManagerService = void 0;
const common_1 = __webpack_require__(1);
const jwt_1 = __webpack_require__(13);
const winstonLogger_1 = __webpack_require__(4);
const user_service_1 = __webpack_require__(146);
const bcrypt = __webpack_require__(97);
let AuthManagerService = class AuthManagerService {
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
        (0, winstonLogger_1.initWinston)('apps/als-hq/logs');
    }
    async validateUser(email, password) {
        const user = await this.userService.userWithPassword({
            email: email,
        });
        if (user && (await bcrypt.compare(password, user.password))) {
            winstonLogger_1.winstonLogger.infoLog.info(`User ${user.email} logged in`);
            return user;
        }
        return null;
    }
    async generateAccessToken(user) {
        const payload = {
            role: user.role,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            img_url: user.img_url,
            sub: user._id,
        };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '',
            }),
        };
    }
};
AuthManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof user_service_1.IUserService !== "undefined" && user_service_1.IUserService) === "function" ? _b : Object])
], AuthManagerService);
exports.AuthManagerService = AuthManagerService;


/***/ }),
/* 148 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(14);
const user_service_1 = __webpack_require__(146);
const passport_jwt_1 = __webpack_require__(149);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
        this.userService = userService;
    }
    async validate(payload) {
        const user = await this.userService.getById(payload.sub.toString());
        if (!user) {
            throw new common_1.HttpException('Not Authorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        return { userId: payload.sub, role: payload.role };
    }
};
JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof user_service_1.IUserService !== "undefined" && user_service_1.IUserService) === "function" ? _a : Object])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),
/* 149 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 150 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(1);
const passport_1 = __webpack_require__(14);
const passport_local_1 = __webpack_require__(151);
const auth_manager_service_1 = __webpack_require__(147);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email', passwordField: 'password' });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_manager_service_1.AuthManagerService !== "undefined" && auth_manager_service_1.AuthManagerService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),
/* 151 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 152 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlsReportingController = void 0;
const common_1 = __webpack_require__(1);
const als_reporting_service_1 = __webpack_require__(153);
let AlsReportingController = class AlsReportingController {
    constructor(alsReportingService) {
        this.alsReportingService = alsReportingService;
    }
    healthCheck() {
        return `ALS Reporting server is listening at port ${process.env.PORT}`;
    }
    ping() {
        return `ALS Reporting is listening`;
    }
};
__decorate([
    (0, common_1.Get)('health-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlsReportingController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AlsReportingController.prototype, "ping", null);
AlsReportingController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof als_reporting_service_1.AlsReportingService !== "undefined" && als_reporting_service_1.AlsReportingService) === "function" ? _a : Object])
], AlsReportingController);
exports.AlsReportingController = AlsReportingController;


/***/ }),
/* 153 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AlsReportingService = void 0;
const common_1 = __webpack_require__(1);
let AlsReportingService = class AlsReportingService {
    getHello() {
        return 'Hello World! from als-reporting';
    }
};
AlsReportingService = __decorate([
    (0, common_1.Injectable)()
], AlsReportingService);
exports.AlsReportingService = AlsReportingService;


/***/ }),
/* 154 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportModule = void 0;
const common_1 = __webpack_require__(1);
const reports_1 = __webpack_require__(155);
const report_controller_1 = __webpack_require__(171);
let ReportModule = class ReportModule {
};
ReportModule = __decorate([
    (0, common_1.Module)({
        imports: [reports_1.ReportsModule],
        controllers: [report_controller_1.ReportController],
        providers: [reports_1.ReportManagerService],
    })
], ReportModule);
exports.ReportModule = ReportModule;


/***/ }),
/* 155 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(156), exports);
__exportStar(__webpack_require__(159), exports);
__exportStar(__webpack_require__(170), exports);


/***/ }),
/* 156 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportManagerService = void 0;
const common_1 = __webpack_require__(1);
const services_1 = __webpack_require__(37);
const errorHandler_1 = __webpack_require__(32);
const fs = __webpack_require__(90);
const closingSummaryGridReport_service_1 = __webpack_require__(157);
const closingSummaryReport_service_1 = __webpack_require__(158);
const coiScheduleInsuranceReport_service_1 = __webpack_require__(160);
const complianceReviewReport_service_1 = __webpack_require__(162);
const dealSummaryReport_service_1 = __webpack_require__(164);
const fullComplianceReport_service_1 = __webpack_require__(165);
const nonComplianceReport_service_1 = __webpack_require__(166);
const policyExpirationReport_service_1 = __webpack_require__(167);
const postClosingSummaryReport_service_1 = __webpack_require__(168);
let ReportManagerService = class ReportManagerService {
    constructor(fullComplianceReport, nonComplianceReport, dealSummaryReport, closingSummaryReport, closingSummaryGridReport, policyExpirationReport, complianceReviewReport, coiScheduleInsuranceReport, postClosingSummary) {
        this.fullComplianceReport = fullComplianceReport;
        this.nonComplianceReport = nonComplianceReport;
        this.dealSummaryReport = dealSummaryReport;
        this.closingSummaryReport = closingSummaryReport;
        this.closingSummaryGridReport = closingSummaryGridReport;
        this.policyExpirationReport = policyExpirationReport;
        this.complianceReviewReport = complianceReviewReport;
        this.coiScheduleInsuranceReport = coiScheduleInsuranceReport;
        this.postClosingSummary = postClosingSummary;
    }
    async create(body) {
        try {
            switch (body.report) {
                case 'compliance_review_report':
                    const CRReport = await this.complianceReviewReport.create(body);
                    const pdf = await this.fullComplianceReport.generatPDF(JSON.parse(JSON.stringify(CRReport[0])), 'compliance_review_report.hbs');
                    return { data: pdf, type: 'html' };
                case 'full_compliance_report':
                    const FCR = await this.fullComplianceReport.create(body);
                    const fullComplianceReportHTML = await this.fullComplianceReport.generatPDF(JSON.parse(JSON.stringify(FCR[0])), 'full_compliance_report.hbs');
                    return { data: fullComplianceReportHTML, type: 'html' };
                case 'non_compliance_report':
                    const NCR = await this.nonComplianceReport.create(body);
                    const nonComplianceReportHTML = await this.fullComplianceReport.generatPDF(JSON.parse(JSON.stringify(NCR[0])), 'non_compliance_report.hbs');
                    return { data: nonComplianceReportHTML, type: 'html' };
                case 'closing_summary_brief':
                    const CSReport = await this.closingSummaryReport.create(body);
                    const CSReportHTML = await this.fullComplianceReport.generatPDF(JSON.parse(JSON.stringify(CSReport[0])), 'closing_summary_report.hbs');
                    return { data: CSReportHTML, type: 'html' };
                case 'closing_summary_grid':
                    const CSGReport = await this.closingSummaryGridReport.create(body);
                    const CSGReportHTML = await this.fullComplianceReport.generatPDF(JSON.parse(JSON.stringify(CSGReport)), 'closing_summary_grid_report.hbs');
                    return { data: CSGReportHTML, type: 'html' };
                case 'coi_schedule_of_insurance':
                    const SOIReport = await this.coiScheduleInsuranceReport.create(body);
                    const scheduleOfInsuranceReportHtml = await this.fullComplianceReport.generatPDF(JSON.parse(JSON.stringify(SOIReport[0])), 'schedule_of_insurance_report.hbs');
                    return { data: scheduleOfInsuranceReportHtml, type: 'html' };
                case 'deal_summary_report':
                    const dealSummaryReportHtml = await this.dealSummaryReport.create(body);
                    return { data: dealSummaryReportHtml, type: 'html' };
                case 'policy_expiration_report':
                    const policyExpirationHtml = await this.policyExpirationReport.create(body);
                    return { data: policyExpirationHtml, type: 'html' };
                case 'excel_test':
                    const filePath = 'libs/reports/sample.xls';
                    const excelContent = fs.readFileSync(filePath);
                    return { data: excelContent, type: 'excel' };
                case 'post_closing_summary':
                    const PCSJson = await this.postClosingSummary.create(body);
                    services_1.Logger.log(JSON.stringify(PCSJson, null, 2));
                    if (Array.isArray(PCSJson) && PCSJson.length < 1) {
                        throw new common_1.HttpException('No Such Data Exist', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                    const PCSExcel = await this.postClosingSummary.generateExcelFile(PCSJson[0]);
                    return { data: PCSExcel, type: 'excel' };
                default:
                    throw new common_1.HttpException('Something Went Wrong', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        catch (error) {
            throw (0, errorHandler_1.errorHandler)(error);
        }
    }
};
ReportManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof fullComplianceReport_service_1.FullComplianceReport !== "undefined" && fullComplianceReport_service_1.FullComplianceReport) === "function" ? _a : Object, typeof (_b = typeof nonComplianceReport_service_1.NonComplianceReport !== "undefined" && nonComplianceReport_service_1.NonComplianceReport) === "function" ? _b : Object, typeof (_c = typeof dealSummaryReport_service_1.DealSummaryReport !== "undefined" && dealSummaryReport_service_1.DealSummaryReport) === "function" ? _c : Object, typeof (_d = typeof closingSummaryReport_service_1.ClosingSummaryReport !== "undefined" && closingSummaryReport_service_1.ClosingSummaryReport) === "function" ? _d : Object, typeof (_e = typeof closingSummaryGridReport_service_1.ClosingSummaryGridReport !== "undefined" && closingSummaryGridReport_service_1.ClosingSummaryGridReport) === "function" ? _e : Object, typeof (_f = typeof policyExpirationReport_service_1.PolicyExpirationReport !== "undefined" && policyExpirationReport_service_1.PolicyExpirationReport) === "function" ? _f : Object, typeof (_g = typeof complianceReviewReport_service_1.ComplianceReviewReport !== "undefined" && complianceReviewReport_service_1.ComplianceReviewReport) === "function" ? _g : Object, typeof (_h = typeof coiScheduleInsuranceReport_service_1.CoiScheduleInsuranceReport !== "undefined" && coiScheduleInsuranceReport_service_1.CoiScheduleInsuranceReport) === "function" ? _h : Object, typeof (_j = typeof postClosingSummaryReport_service_1.PostClosingSummaryReport !== "undefined" && postClosingSummaryReport_service_1.PostClosingSummaryReport) === "function" ? _j : Object])
], ReportManagerService);
exports.ReportManagerService = ReportManagerService;


/***/ }),
/* 157 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClosingSummaryGridReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let ClosingSummaryGridReport = class ClosingSummaryGridReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
    }
    convertToCamelCase(str) {
        const words = str.toLowerCase().split(' ');
        const firstWord = words.shift();
        const rest = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return firstWord + rest.join('');
    }
    async create(body) {
        const closingSummaryResponse = [];
        const { projects } = await this.getProjects({
            client_id: body.client_id,
        });
        const client = await this.ClientModel.findOne({
            _id: body.client_id,
        }).lean();
        const projectCount = projects.length;
        for (const project of projects) {
            const closing_summary_grid = Object.assign({ name: project.name, closing_date: project.project_schedule.closing_date.toLocaleDateString() }, project.material_documents.reduce((acc, item) => {
                const key = this.convertToCamelCase(item.name);
                acc[key] = { status: item.status };
                return acc;
            }, {}));
            closingSummaryResponse.push(closing_summary_grid);
        }
        return {
            projects: closingSummaryResponse,
            count: projectCount,
            date: new Date().toLocaleDateString(),
            client: client === null || client === void 0 ? void 0 : client.name,
        };
    }
    async getProjects({ client_id }) {
        const projectCondition = {};
        const projectResponse = [];
        if (client_id) {
            projectCondition['client.client_id'] = new mongodb_1.ObjectId(client_id);
        }
        projectCondition['deal_summary.client_stage'] = 'Pre-Construction';
        const project = await this.ProjectModel.find(projectCondition).lean();
        if (!project) {
            throw new Error('Project Not Found');
        }
        projectResponse.push(...project);
        return { projects: projectResponse };
    }
};
ClosingSummaryGridReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], ClosingSummaryGridReport);
exports.ClosingSummaryGridReport = ClosingSummaryGridReport;


/***/ }),
/* 158 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClosingSummaryReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const mongoose_2 = __webpack_require__(28);
const reportHelper_1 = __webpack_require__(159);
let ClosingSummaryReport = class ClosingSummaryReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.reportHelper = reportHelper;
    }
    async create(body) {
        const closingSummaryResponse = [];
        let { compliances, projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        if (projects.length !== 0) {
            for (const project of projects) {
                const contactDetails = await this.reportHelper.getContactDetails(project._id.toString());
                const closing_summary = {
                    status_as_of: new Date().toISOString().slice(0, 10),
                    project_details: {
                        name: project.name,
                        investor: project.parties_to_the_transaction.investor_bank,
                        hhc_engineer: project.deal_summary.engineer,
                        als_analyst: project.deal_summary.analyst,
                        general_partner: contactDetails['General Partner'],
                        general_contractor: contactDetails['General Contractor'],
                        rehab_or_new_const: project.deal_summary.rehab_or_new_const,
                        bldg_rcv: project.project_schedule.bldg_rcv,
                        hard_cost: project.project_schedule.hard_costs,
                        soft_cost: project.project_schedule.soft_costs,
                        loss_rents_12mo: project.project_schedule.loss_rents,
                        closing_date: new Date(project.project_schedule.closing_date.toString())
                            .toISOString()
                            .slice(0, 10),
                    },
                    comments: [
                        ...project.material_documents
                            .map(item => (item.vers_date ? item.vers_date : '') + ' ' + item.comments)
                            .filter(item => item.length > 1),
                        ...project.certificates
                            .map(item => (item.vers_date ? item.vers_date : '') + ' ' + item.comments)
                            .filter(item => item.length > 1),
                    ],
                    material_documents: project.material_documents,
                    certificates_and_supporting: project.certificates,
                };
                closingSummaryResponse.push(closing_summary);
            }
        }
        return closingSummaryResponse;
    }
};
ClosingSummaryReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _f : Object])
], ClosingSummaryReport);
exports.ClosingSummaryReport = ClosingSummaryReport;


/***/ }),
/* 159 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportHelper = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const apiError_1 = __webpack_require__(31);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const mongodb_1 = __webpack_require__(25);
const mongoose_2 = __webpack_require__(28);
let ReportHelper = class ReportHelper {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
    }
    async getCompliancesAndProjects({ client_id, projectIdVendorIds, }) {
        const complianceCondition = {};
        const projectCondition = {};
        const complianceResponse = [];
        const projectResponse = [];
        if (client_id) {
            complianceCondition['client_id'] = new mongodb_1.ObjectId(client_id);
            projectCondition['client.client_id'] = new mongodb_1.ObjectId(client_id);
        }
        if (projectIdVendorIds && projectIdVendorIds.length > 0) {
            for (const projectVendor of projectIdVendorIds) {
                complianceCondition['project_id'] = new mongodb_1.ObjectId(projectVendor.project_id);
                projectCondition['_id'] = new mongodb_1.ObjectId(projectVendor.project_id);
                for (const vendorId of projectVendor.vendor_id) {
                    complianceCondition['vendor_id'] = new mongodb_1.ObjectId(vendorId);
                    projectCondition['assigned_vendor.vendor_id'] = new mongodb_1.ObjectId(vendorId);
                    const compliance = await this.ComplianceModel.aggregate([
                        {
                            $match: complianceCondition,
                        },
                        {
                            $lookup: {
                                from: 'masterrequirementmodels',
                                let: {
                                    letId: '$compliance_items.master_requirement_id',
                                    tempId: '$template_items.master_requirement_id',
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [
                                                    { $in: ['$_id', '$$letId'] },
                                                    { $in: ['$_id', '$$tempId'] },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            requirement_description: 1,
                                            coverage_type_name: 1,
                                            default_comment: 1,
                                        },
                                    },
                                ],
                                as: 'master_requirement',
                            },
                        },
                        {
                            $addFields: {
                                compliance_items: {
                                    $map: {
                                        input: '$compliance_items',
                                        as: 'rel',
                                        in: {
                                            $mergeObjects: [
                                                '$$rel',
                                                {
                                                    master_requirement: {
                                                        $arrayElemAt: [
                                                            '$master_requirement',
                                                            {
                                                                $indexOfArray: [
                                                                    '$master_requirement._id',
                                                                    '$$rel.master_requirement_id',
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $addFields: {
                                template_items: {
                                    $map: {
                                        input: '$template_items',
                                        as: 'rel',
                                        in: {
                                            $mergeObjects: [
                                                '$$rel',
                                                {
                                                    master_requirement: {
                                                        $arrayElemAt: [
                                                            '$master_requirement',
                                                            {
                                                                $indexOfArray: [
                                                                    '$master_requirement._id',
                                                                    '$$rel.master_requirement_id',
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                master_requirement: 0,
                            },
                        },
                    ]);
                    if (compliance.length < 1) {
                        throw new Error('Compliance Not Found');
                    }
                    for (let i = compliance.length - 1; i >= 0; i--) {
                        if (compliance[i].status === false) {
                            compliance.splice(i, 1);
                        }
                        else {
                            complianceResponse.push(compliance[i]);
                        }
                    }
                    delete complianceCondition.vendor_id;
                    delete projectCondition['assigned_vendor.vendor_id'];
                }
                const project = await this.ProjectModel.findOne(projectCondition);
                if (!project) {
                    throw new Error('Project Not Found');
                }
                projectResponse.push(project);
                delete projectCondition._id;
                delete complianceCondition.project_id;
            }
        }
        return { compliances: complianceResponse, projects: projectResponse };
    }
    async advanceFilter(body, compliances, projects) {
        if (body.coverage_type) {
            for (const compliance of compliances) {
                for (let i = compliance.compliance_items.length - 1; i >= 0; i--) {
                    const object = compliance.compliance_items[i];
                    if (object.master_requirement) {
                        if (!body.coverage_type.includes(object === null || object === void 0 ? void 0 : object.master_requirement.coverage_type_name)) {
                            compliance.compliance_items.splice(i, 1);
                        }
                    }
                }
                for (let i = compliance.template_items.length - 1; i >= 0; i--) {
                    const object = compliance.template_items[i];
                    if (object.master_requirement) {
                        if (!body.coverage_type.includes(object === null || object === void 0 ? void 0 : object.master_requirement.coverage_type_name)) {
                            compliance.template_items.splice(i, 1);
                        }
                    }
                }
            }
        }
        if (body.insurance_co ||
            body.broker ||
            body.client_stage ||
            (body.start_date && body.closing_date)) {
            for (let i = projects.length - 1; i >= 0; i--) {
                if (body.client_stage &&
                    projects[i].deal_summary.client_stage !== body.client_stage) {
                    projects.splice(i, 1);
                }
                if (body.start_date && body.closing_date) {
                    if (body.closing_date < body.start_date) {
                        throw new apiError_1.ServiceError('Closing date must be gretaer!');
                    }
                    const dbClosingDate = projects[i].project_schedule
                        .closing_date;
                    const reqClosingDate = new Date(body.closing_date);
                    const reqStartingDate = new Date(body.start_date);
                    const dbDate = new Date(dbClosingDate.getFullYear(), dbClosingDate.getMonth(), dbClosingDate.getDate());
                    const reqCloseDate = new Date(reqClosingDate.getFullYear(), reqClosingDate.getMonth(), reqClosingDate.getDate());
                    const reqStartDate = new Date(reqStartingDate.getFullYear(), reqStartingDate.getMonth(), reqStartingDate.getDate());
                    if (dbDate.getTime() <= reqStartDate.getTime() &&
                        dbDate.getTime() >= reqCloseDate.getTime()) {
                        projects.splice(i, 1);
                    }
                }
                if (body.broker || body.insurance_co) {
                    const contactDetails = await this.getContactDetails(projects[i]._id.toString());
                    if (body.broker &&
                        contactDetails.hasOwnProperty('Broker') &&
                        !contactDetails.Broker.includes(body.broker)) {
                        projects.splice(i, 1);
                    }
                    if (body.insurance_co &&
                        contactDetails.hasOwnProperty('Insurance Company') &&
                        !contactDetails['Insurance Company'].includes(body.insurance_co)) {
                        projects.splice(i, 1);
                    }
                }
            }
        }
        return [compliances, projects];
    }
    async getContactDetails(id) {
        const response = await this.ProjectModel.aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(id),
                },
            },
            {
                $unwind: '$assigned_vendor',
            },
            {
                $lookup: {
                    from: 'vendormodels',
                    localField: 'assigned_vendor.vendor_id',
                    foreignField: '_id',
                    as: 'vendor',
                },
            },
            {
                $unwind: '$vendor',
            },
            {
                $lookup: {
                    from: 'contactmodels',
                    localField: 'vendor.contacts_id',
                    foreignField: '_id',
                    as: 'contact_details',
                },
            },
            {
                $unwind: '$contact_details',
            },
            {
                $project: {
                    _id: '$contact_details._id',
                    first_name: '$contact_details.first_name',
                    last_name: '$contact_details.last_name',
                    company_name: '$contact_details.company_name',
                    type: '$contact_details.type',
                },
            },
        ]);
        const result = await this.ProjectModel.aggregate([
            {
                $match: {
                    _id: new mongodb_1.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: 'contactmodels',
                    localField: 'contacts',
                    foreignField: '_id',
                    as: 'contactsInfo',
                },
            },
            {
                $unwind: '$contactsInfo',
            },
            {
                $project: {
                    _id: '$contactsInfo._id',
                    first_name: '$contactsInfo.first_name',
                    last_name: '$contactsInfo.last_name',
                    company_name: '$contactsInfo.company_name',
                    type: '$contactsInfo.type',
                },
            },
        ]);
        const contactDetails = response.concat(result);
        return this.groupData(contactDetails);
    }
    async groupData(contactInfo) {
        const res = contactInfo.reduce((result, item) => {
            const key = item.type;
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(item.company_name);
            return result;
        }, {});
        return res;
    }
};
ReportHelper = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], ReportHelper);
exports.ReportHelper = ReportHelper;


/***/ }),
/* 160 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CoiScheduleInsuranceReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const reportHelper_1 = __webpack_require__(161);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const mongoose_2 = __webpack_require__(28);
const reportHelper_2 = __webpack_require__(159);
let CoiScheduleInsuranceReport = class CoiScheduleInsuranceReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.reportHelper = reportHelper;
    }
    async create(body) {
        let { compliances, projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        const client = await this.ClientModel.findOne({
            _id: body.client_id,
        }).lean();
        const vendor = await this.VendorModel.findOne({
            _id: body.projectVendor[0].vendor_id,
        }).lean();
        const result = (0, reportHelper_1.coiScheduleOfInsuranceHelper)(compliances);
        const now = new Date();
        const month = ('0' + (now.getMonth() + 1)).slice(-2);
        const day = ('0' + now.getDate()).slice(-2);
        const year = now.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;
        result.forEach((item) => {
            item['client'] = client;
            item['vendor'] = vendor;
            item['date'] = formattedDate;
        });
        return result;
    }
};
CoiScheduleInsuranceReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof reportHelper_2.ReportHelper !== "undefined" && reportHelper_2.ReportHelper) === "function" ? _f : Object])
], CoiScheduleInsuranceReport);
exports.CoiScheduleInsuranceReport = CoiScheduleInsuranceReport;


/***/ }),
/* 161 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.coiScheduleOfInsuranceHelper = exports.postClosing_CoverageType = void 0;
function postClosing_CoverageType(compliance_item) {
    const res = compliance_item.reduce((result, item) => {
        var _a, _b, _c;
        const key = item.master_requirement_detail.coverage_type_name;
        if (!result[key]) {
            result[key] = [];
        }
        const postClosing = {
            course_of_construction: item.master_requirement_detail.coverage_type_name,
            requirements: item.master_requirement_detail.requirement_description,
            required_limits: item.required_limit,
            actual_limits: item.actual_limit,
            comments: item.comment,
            waiver: (_a = item.waiver) !== null && _a !== void 0 ? _a : false,
            post_closing: (_b = item.post_closing) !== null && _b !== void 0 ? _b : false,
            show: (_c = item.show) !== null && _c !== void 0 ? _c : false,
        };
        result[key].push(postClosing);
        return result;
    }, {});
    return res;
}
exports.postClosing_CoverageType = postClosing_CoverageType;
function coiScheduleOfInsuranceHelper(complianceResponse) {
    const coiResponse = [];
    for (const compliance of complianceResponse) {
        const result = compliance.template_items.reduce((acc, item) => {
            const key = `${item.master_requirement.coverage_type_name}-${item.policy_number}-${item.named_insured}`;
            if (!acc[key]) {
                acc[key] = {
                    name: item.master_requirement.coverage_type_name,
                    policy_number: item.policy_number,
                    named_insured: item.named_insured,
                    items: [],
                };
            }
            acc[key].items.push({
                default_comment: item.master_requirement.default_comment,
                actual_limit: item.actual_limit,
                requirement_description: item.master_requirement.requirement_description,
            });
            return acc;
        }, {});
        const resultArray = Object.values(result);
        coiResponse.push(...resultArray);
        return coiResponse;
    }
}
exports.coiScheduleOfInsuranceHelper = coiScheduleOfInsuranceHelper;


/***/ }),
/* 162 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComplianceReviewReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const template_model_1 = __webpack_require__(34);
const vendor_model_1 = __webpack_require__(82);
const fs = __webpack_require__(90);
const Handlebars = __webpack_require__(163);
const mongoose_2 = __webpack_require__(28);
const path = __webpack_require__(92);
const reportHelper_1 = __webpack_require__(159);
Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
let ComplianceReviewReport = class ComplianceReviewReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, TemplateModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.TemplateModel = TemplateModel;
        this.reportHelper = reportHelper;
        this.groupByCoverageType = (complianceItems) => {
            const groupedItems = {};
            complianceItems.forEach(item => {
                const { coverage_type } = item, rest = __rest(item, ["coverage_type"]);
                if (!groupedItems[coverage_type]) {
                    groupedItems[coverage_type] = [];
                }
                groupedItems[coverage_type].push(rest);
            });
            return Object.entries(groupedItems).map(([coverage_type, items]) => ({
                coverage_type,
                items,
            }));
        };
    }
    async create(body) {
        var _a, _b, _c, _d;
        const compliance_items = [];
        const template_items = [];
        const fullComplianceResponse = [];
        let { compliances, projects: projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        const client = await this.ClientModel.findOne({
            _id: body.client_id,
        }).lean();
        const vendor = await this.VendorModel.findOne({
            _id: body.projectVendor[0].vendor_id,
        }).lean();
        for (const project of projects) {
            const contactDetails = await this.reportHelper.getContactDetails(project._id.toString());
            for (const comp of compliances) {
                if (project._id.equals(comp.project_id)) {
                    for (const compliance of comp.compliance_items) {
                        const obj = {
                            coverage_type: ((_a = compliance.master_requirement) === null || _a === void 0 ? void 0 : _a.coverage_type_name) || '',
                            master_requirement_des: ((_b = compliance.master_requirement) === null || _b === void 0 ? void 0 : _b.requirement_description) || '',
                            required_limit: compliance.required_limit,
                            actual_limit: compliance.actual_limit,
                            status: compliance.status,
                            comment: compliance.comment,
                            named_insured: 'NA',
                            expiry_date: compliance.expiry_date || 'NA',
                            show: compliance.show,
                            waiver: compliance.waiver,
                            post_closing: compliance.post_closing,
                            document_name: compliance.document_name || '-',
                        };
                        compliance_items.push(obj);
                    }
                    for (const template of comp.template_items) {
                        const temp = await this.TemplateModel.findOne({
                            _id: template.template_id,
                            'rules._id': template.template_rule_id,
                        });
                        const rule = temp === null || temp === void 0 ? void 0 : temp.rules.find(rule => rule._id.equals(template.template_rule_id));
                        const obj = {
                            coverage_type: ((_c = template.master_requirement) === null || _c === void 0 ? void 0 : _c.coverage_type_name) || '',
                            master_requirement_des: ((_d = template.master_requirement) === null || _d === void 0 ? void 0 : _d.requirement_description) || '',
                            required_limit: rule ? `${rule.condition} ${rule.value}` : 'NA',
                            actual_limit: template.actual_limit,
                            status: template.status,
                            named_insured: template.named_insured || 'NA',
                            comment: (rule === null || rule === void 0 ? void 0 : rule.message) || 'NA',
                            expiry_date: template.expiry_date || 'NA',
                            policy_number: template.policy_number || 'NA',
                            show: template.show,
                            waiver: template.waiver,
                            post_closing: template.post_closing,
                            document_name: template.document_name || '-',
                        };
                        template_items.push(obj);
                    }
                }
            }
            const complianceReview = {
                summary: {
                    hard_costs: project.project_schedule.hard_costs,
                    soft_costs: project.project_schedule.soft_costs,
                    loss_of_rents: project.project_schedule.loss_rents,
                    rehab_new: project.deal_summary.rehab_or_new_const,
                    flood_zone: project.deal_summary.flood_zone,
                    eq_zone: project.deal_summary.eq_zone,
                    wind_tier: project.deal_summary.wind_tier,
                    replacement_cost: project.project_schedule.replacement_cost,
                    closing_date: new Date(project.project_schedule.closing_date).toLocaleDateString(),
                    investor: project.parties_to_the_transaction.investor_bank,
                    additional_insureds: project.parties_to_the_transaction.additional_insured,
                    general_contractor: contactDetails['General Contractor'],
                    property_manager: contactDetails['Property Manager'],
                },
                project: project.name,
                cert_holder: {
                    first_name: project.certificate_holders[0].first_name,
                    last_name: project.certificate_holders[0].last_name,
                },
                compliance_items: this.groupByCoverageType([
                    ...compliance_items,
                    ...template_items,
                ]),
                client: client,
                vendor: vendor,
            };
            fullComplianceResponse.push(complianceReview);
        }
        return fullComplianceResponse;
    }
    async generatPDF(data, templateName) {
        const templatePath = path.join(__dirname, 'templates', templateName);
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const renderedHtml = template(data);
        return renderedHtml;
    }
};
ComplianceReviewReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __param(5, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _g : Object])
], ComplianceReviewReport);
exports.ComplianceReviewReport = ComplianceReviewReport;
[];


/***/ }),
/* 163 */
/***/ ((module) => {

module.exports = require("handlebars");

/***/ }),
/* 164 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DealSummaryReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const mongoose_2 = __webpack_require__(28);
const reportHelper_1 = __webpack_require__(159);
let DealSummaryReport = class DealSummaryReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.reportHelper = reportHelper;
    }
    async create(body) {
        const dealSummaryResponse = [];
        let { compliances, projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        if (projects.length !== 0) {
            for (const project of projects) {
                const contactDetails = await this.reportHelper.getContactDetails(project._id.toString());
                const deal_summary = {
                    project_name_address: {
                        property_name: project.property_name,
                        address: project.address_1 + ' ' + project.address_2,
                        city: project.city,
                        state: project.state,
                        zip: project.zip,
                        county: project.county,
                    },
                    property_details: {
                        engineer: project.deal_summary.engineer,
                        analyst: project.deal_summary.analyst,
                        elevators: project.deal_summary.elevator_number,
                        pool: project.deal_summary.pool,
                        est_const_period: project.deal_summary.est_const_period,
                        other_key_info: project.deal_summary.other_key_info,
                        project_description: project.deal_summary.project_description,
                        total_units: project.deal_summary.total_units,
                        playground_area: project.deal_summary.playground_area,
                        rehab_or_new_const: project.deal_summary.rehab_or_new_const,
                        tenancy: project.deal_summary.tenancy,
                        tenant_commercial: project.deal_summary.tenant_commercial,
                        total_square_feets: project.deal_summary.total_square_foot,
                    },
                    values_and_critical_dates: {
                        bldg_pers_prop: project.project_schedule.bldg_pers_prop,
                        bldg_rcv: project.project_schedule.bldg_rcv,
                        closing_date: project.project_schedule.closing_date.toString(),
                        const_start_date: project.project_schedule.construction_start_date.toString(),
                        est_perm_inst_cost: project.project_schedule.estimated_prem_ins_cost,
                        estimated_construction_completion_date: project.project_schedule.estimated_construction_completion_date.toString(),
                        hard_cost: project.project_schedule.hard_costs,
                        loss_rents_12mo: project.project_schedule.loss_rents,
                        soft_cost: project.project_schedule.soft_costs,
                        tco_date: project.project_schedule.tco_date.toString(),
                        initial_comp_rpt_sent: project.project_schedule.Initial_comp_rpt_sent,
                        in_constructions: project.project_schedule.in_constructions,
                    },
                    parties_to_the_trancsaction: {
                        named_insured_partner: project.parties_to_the_transaction.named_insured_partnership,
                        add_l_Ins: project.parties_to_the_transaction.add_l_Ins,
                        add_l_Ins_special_member: project.parties_to_the_transaction.add_l_Ins_special_member,
                        add_l_Ins_tax_credit_investment_fund: project.parties_to_the_transaction
                            .add_l_Ins_tax_credit_investment_fund,
                        add_l_Ins_investment_member: project.parties_to_the_transaction.add_l_Ins_investment_member,
                        inv_member: project.parties_to_the_transaction.inv_member,
                        investor_bank: project.parties_to_the_transaction.investor_bank,
                    },
                    cope_and_property_exposure: {
                        renovation: project.deal_summary.renovation,
                        high_risk_area: project.deal_summary.high_risk_area,
                        water_protection: project.deal_summary.water_protection,
                        sinkhole_exposure: project.deal_summary.sinkhole_exposure,
                        exterior_finish: project.deal_summary.exterior_finish,
                        construction_type: project.deal_summary.construction_type,
                        eq_zone: project.deal_summary.eq_zone,
                        fire_protection_life_safety: project.deal_summary.fire_protection_safety,
                        flood_zone: project.deal_summary.flood_zone,
                        protection_fire_department: project.deal_summary.fire_protection_safety,
                        roofing: project.deal_summary.roofing,
                        structural_system: project.deal_summary.structural_system,
                        wind_tier: project.deal_summary.wind_tier,
                    },
                    key_project_property_contacts: {
                        underwriter: contactDetails['underwriter'],
                        property_manager: contactDetails['Property Manager'],
                        investor_bank: project.parties_to_the_transaction.investor_bank,
                        asset_mgr: contactDetails['Asset Manager'],
                        property_manager_broker: contactDetails['Property Manager Broker'],
                        general_partner: contactDetails['General Partner'],
                        general_partner_broker: contactDetails['General Partner Broker'],
                    },
                    material_documents: project.material_documents,
                    certificates_and_supporting: project.certificates,
                };
                dealSummaryResponse.push(deal_summary);
            }
        }
        return dealSummaryResponse;
    }
};
DealSummaryReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _f : Object])
], DealSummaryReport);
exports.DealSummaryReport = DealSummaryReport;


/***/ }),
/* 165 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FullComplianceReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const template_model_1 = __webpack_require__(34);
const vendor_model_1 = __webpack_require__(82);
const fs = __webpack_require__(90);
const Handlebars = __webpack_require__(163);
const mongoose_2 = __webpack_require__(28);
const path = __webpack_require__(92);
const reportHelper_1 = __webpack_require__(159);
let FullComplianceReport = class FullComplianceReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, TemplateModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.TemplateModel = TemplateModel;
        this.reportHelper = reportHelper;
        this.groupByCoverageType = (complianceItems) => {
            const groupedItems = {};
            complianceItems.forEach(item => {
                var _a;
                const { coverage_type, policy_number } = item, rest = __rest(item, ["coverage_type", "policy_number"]);
                if (!groupedItems[coverage_type]) {
                    groupedItems[coverage_type] = {
                        items: [],
                        brokers: [],
                        policy_number: 'NA',
                    };
                }
                groupedItems[coverage_type].items.push(rest);
                groupedItems[coverage_type].policy_number = policy_number || 'NA';
                groupedItems[coverage_type].brokers = Array.from(new Set([
                    ...groupedItems[coverage_type].brokers,
                    ...((_a = item.brokers) !== null && _a !== void 0 ? _a : []),
                ]));
            });
            return Object.entries(groupedItems).map(([coverage_type, { items, brokers, policy_number }]) => ({
                coverage_type,
                items,
                brokers,
                policy_number,
            }));
        };
    }
    async create(body) {
        var _a, _b, _c, _d;
        const compliance_items = [];
        const template_items = [];
        const fullComplianceResponse = [];
        let { compliances, projects: projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        const client = await this.ClientModel.findOne({
            _id: body.client_id,
        }).lean();
        const vendor = await this.VendorModel.findOne({
            _id: body.projectVendor[0].vendor_id,
        }).lean();
        if (projects.length !== 0) {
            for (const project of projects) {
                const contactDetails = await this.reportHelper.getContactDetails(project._id.toString());
                if (contactDetails.hasOwnProperty('Broker')) {
                    contactDetails['Broker'] = contactDetails['Broker'].filter((broker) => broker === body.broker);
                }
                for (const comp of compliances) {
                    if (project._id.equals(comp.project_id)) {
                        for (const compliance of comp.compliance_items) {
                            const obj = {
                                coverage_type: ((_a = compliance.master_requirement) === null || _a === void 0 ? void 0 : _a.coverage_type_name) || '',
                                master_requirement_des: ((_b = compliance.master_requirement) === null || _b === void 0 ? void 0 : _b.requirement_description) || '',
                                required_limit: compliance.required_limit,
                                actual_limit: compliance.actual_limit,
                                status: compliance.status,
                                comment: compliance.comment,
                                named_insured: 'NA',
                                expiry_date: compliance.expiry_date || 'NA',
                                brokers: contactDetails['Broker'],
                            };
                            compliance_items.push(obj);
                        }
                        for (const template of comp.template_items) {
                            const temp = await this.TemplateModel.findOne({
                                _id: template.template_id,
                                'rules._id': template.template_rule_id,
                            });
                            const rule = temp === null || temp === void 0 ? void 0 : temp.rules.find(rule => rule._id.equals(template.template_rule_id));
                            const obj = {
                                coverage_type: ((_c = template.master_requirement) === null || _c === void 0 ? void 0 : _c.coverage_type_name) || '',
                                master_requirement_des: ((_d = template.master_requirement) === null || _d === void 0 ? void 0 : _d.requirement_description) || '',
                                required_limit: rule ? `${rule.condition} ${rule.value}` : 'NA',
                                actual_limit: template.actual_limit,
                                status: template.status,
                                named_insured: template.named_insured || 'NA',
                                comment: (rule === null || rule === void 0 ? void 0 : rule.message) || 'NA',
                                expiry_date: template.expiry_date || 'NA',
                                brokers: contactDetails['Broker'],
                                policy_number: template.policy_number,
                            };
                            template_items.push(obj);
                        }
                    }
                }
                const fullCompliance = {
                    summary: {
                        hard_costs: project.project_schedule.hard_costs,
                        soft_costs: project.project_schedule.soft_costs,
                        loss_of_rents: project.project_schedule.loss_rents,
                        rehab_new: project.deal_summary.rehab_or_new_const,
                        flood_zone: project.deal_summary.flood_zone,
                        eq_zone: project.deal_summary.eq_zone,
                        wind_tier: project.deal_summary.wind_tier,
                        replacement_cost: project.project_schedule.replacement_cost,
                        closing_date: new Date(project.project_schedule.closing_date).toLocaleDateString(),
                        investor: project.parties_to_the_transaction.investor_bank,
                        additional_insureds: project.parties_to_the_transaction.additional_insured,
                        general_contractor: contactDetails['General Contractor'],
                        property_manager: contactDetails['Property Manager'],
                    },
                    project: project.name,
                    cert_holder: {
                        first_name: project.certificate_holders[0].first_name,
                        last_name: project.certificate_holders[0].last_name,
                    },
                    compliance_items: this.groupByCoverageType([
                        ...compliance_items,
                        ...template_items,
                    ]),
                    client: client,
                    vendor: vendor,
                };
                fullComplianceResponse.push(fullCompliance);
            }
        }
        return fullComplianceResponse;
    }
    async generatPDF(data, templateName) {
        const templatePath = path.join(__dirname, 'templates', templateName);
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const renderedHtml = template(data);
        return renderedHtml;
    }
};
FullComplianceReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __param(5, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _g : Object])
], FullComplianceReport);
exports.FullComplianceReport = FullComplianceReport;
[];


/***/ }),
/* 166 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonComplianceReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const template_model_1 = __webpack_require__(34);
const vendor_model_1 = __webpack_require__(82);
const fs = __webpack_require__(90);
const Handlebars = __webpack_require__(163);
const mongoose_2 = __webpack_require__(28);
const path = __webpack_require__(92);
const reportHelper_1 = __webpack_require__(159);
let NonComplianceReport = class NonComplianceReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, TemplateModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.TemplateModel = TemplateModel;
        this.reportHelper = reportHelper;
        this.groupByCoverageType = (complianceItems) => {
            const groupedItems = {};
            complianceItems.forEach(item => {
                var _a;
                const { coverage_type, policy_number } = item, rest = __rest(item, ["coverage_type", "policy_number"]);
                if (!groupedItems[coverage_type]) {
                    groupedItems[coverage_type] = {
                        items: [],
                        brokers: [],
                        policy_number: 'NA',
                    };
                }
                groupedItems[coverage_type].items.push(rest);
                groupedItems[coverage_type].policy_number = policy_number || 'NA';
                groupedItems[coverage_type].brokers = Array.from(new Set([
                    ...groupedItems[coverage_type].brokers,
                    ...((_a = item.brokers) !== null && _a !== void 0 ? _a : []),
                ]));
            });
            return Object.entries(groupedItems).map(([coverage_type, { items, brokers, policy_number }]) => ({
                coverage_type,
                items,
                brokers,
                policy_number,
            }));
        };
    }
    async create(body) {
        var _a, _b, _c, _d;
        const compliance_items = [];
        const template_items = [];
        const fullComplianceResponse = [];
        let { compliances, projects: projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        const client = await this.ClientModel.findOne({
            _id: body.client_id,
        }).lean();
        const vendor = await this.VendorModel.findOne({
            _id: body.projectVendor[0].vendor_id,
        }).lean();
        if (projects.length !== 0) {
            for (const project of projects) {
                const contactDetails = await this.reportHelper.getContactDetails(project._id.toString());
                for (const comp of compliances) {
                    if (project._id.equals(comp.project_id)) {
                        for (const compliance of comp.compliance_items) {
                            if (compliance.status !== 'G') {
                                const obj = {
                                    coverage_type: ((_a = compliance.master_requirement) === null || _a === void 0 ? void 0 : _a.coverage_type_name) || '',
                                    master_requirement_des: ((_b = compliance.master_requirement) === null || _b === void 0 ? void 0 : _b.requirement_description) ||
                                        '',
                                    required_limit: compliance.required_limit,
                                    actual_limit: compliance.actual_limit,
                                    status: compliance.status,
                                    comment: compliance.comment,
                                    named_insured: 'NA',
                                    expiry_date: compliance.expiry_date || 'NA',
                                    brokers: contactDetails['Broker'],
                                };
                                compliance_items.push(obj);
                            }
                        }
                        for (const template of comp.template_items) {
                            if (template.status !== 'G') {
                                const temp = await this.TemplateModel.findOne({
                                    _id: template.template_id,
                                    'rules._id': template.template_rule_id,
                                });
                                const rule = temp === null || temp === void 0 ? void 0 : temp.rules.find(rule => rule._id.equals(template.template_rule_id));
                                const obj = {
                                    coverage_type: ((_c = template.master_requirement) === null || _c === void 0 ? void 0 : _c.coverage_type_name) || '',
                                    master_requirement_des: ((_d = template.master_requirement) === null || _d === void 0 ? void 0 : _d.requirement_description) || '',
                                    required_limit: rule
                                        ? `${rule.condition} ${rule.value}`
                                        : 'NA',
                                    actual_limit: template.actual_limit,
                                    status: template.status,
                                    named_insured: template.named_insured || 'NA',
                                    comment: (rule === null || rule === void 0 ? void 0 : rule.message) || 'NA',
                                    expiry_date: template.expiry_date || 'NA',
                                    brokers: contactDetails['Broker'],
                                    policy_number: template.policy_number,
                                };
                                template_items.push(obj);
                            }
                        }
                    }
                }
                const fullCompliance = {
                    summary: {
                        hard_costs: project.project_schedule.hard_costs,
                        soft_costs: project.project_schedule.soft_costs,
                        loss_of_rents: project.project_schedule.loss_rents,
                        rehab_new: project.deal_summary.rehab_or_new_const,
                        flood_zone: project.deal_summary.flood_zone,
                        eq_zone: project.deal_summary.eq_zone,
                        wind_tier: project.deal_summary.wind_tier,
                        replacement_cost: project.project_schedule.replacement_cost,
                        closing_date: new Date(project.project_schedule.closing_date).toLocaleDateString(),
                        investor: project.parties_to_the_transaction.investor_bank,
                        additional_insureds: project.parties_to_the_transaction.additional_insured,
                        general_contractor: contactDetails['General Contractor'],
                        property_manager: contactDetails['Property Manager'],
                    },
                    project: project.name,
                    cert_holder: {
                        first_name: project.certificate_holders[0].first_name,
                        last_name: project.certificate_holders[0].last_name,
                    },
                    compliance_items: this.groupByCoverageType([
                        ...compliance_items,
                        ...template_items,
                    ]),
                    client: client,
                    vendor: vendor,
                };
                fullComplianceResponse.push(fullCompliance);
            }
        }
        return fullComplianceResponse;
    }
    async generatPDF(data, templateName) {
        const templatePath = path.join(__dirname, 'templates', templateName);
        const templateSource = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateSource);
        const renderedHtml = template(data);
        return renderedHtml;
    }
};
NonComplianceReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __param(5, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _g : Object])
], NonComplianceReport);
exports.NonComplianceReport = NonComplianceReport;
[];


/***/ }),
/* 167 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PolicyExpirationReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const vendor_model_1 = __webpack_require__(82);
const mongoose_2 = __webpack_require__(28);
const reportHelper_1 = __webpack_require__(159);
let PolicyExpirationReport = class PolicyExpirationReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.reportHelper = reportHelper;
    }
    async create(body) {
        const policyExpirationReport = [];
        let { compliances, projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        if (projects.length !== 0) {
            for (const project of projects) {
                const client = await this.ClientModel.findById(project.client.client_id);
                const policy_expiration = {
                    client: project.client.name,
                    client_address: (client === null || client === void 0 ? void 0 : client.address_1) + ' ' + (client === null || client === void 0 ? void 0 : client.address_2),
                    certificate: project.certificate_holders.zip,
                    exp_date: '',
                    type_of_ins: '',
                    policy_no: '',
                    insurance_co: '',
                    broker_name: '',
                    analyst: project.deal_summary.analyst,
                    asset_Mgr: project.manager.name,
                    project_name: project.name,
                    client_stage: project.deal_summary.client_stage,
                    project_address: project.address_1 + ' ' + project.address_2,
                    date1: project.project_schedule.construction_start_date.toString(),
                    date2: project.project_schedule.estimated_construction_completion_date.toString(),
                    date3: project.project_schedule.tco_date.toString(),
                    date14: project.project_schedule.closing_date.toString(),
                };
                policyExpirationReport.push(policy_expiration);
            }
        }
        return policyExpirationReport;
    }
};
PolicyExpirationReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _f : Object])
], PolicyExpirationReport);
exports.PolicyExpirationReport = PolicyExpirationReport;


/***/ }),
/* 168 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostClosingSummaryReport = void 0;
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(19);
const client_model_1 = __webpack_require__(42);
const compliance_model_1 = __webpack_require__(62);
const project_model_1 = __webpack_require__(27);
const master_requirement_model_1 = __webpack_require__(33);
const template_model_1 = __webpack_require__(34);
const vendor_model_1 = __webpack_require__(82);
const mongoose_2 = __webpack_require__(28);
const XLSX = __webpack_require__(169);
const reportHelper_1 = __webpack_require__(159);
const borderStyle = 'thin';
const borderColor = { rgb: ' CFCFCF' };
const border = {
    top: { style: borderStyle, color: borderColor },
    bottom: { style: borderStyle, color: borderColor },
    left: { style: borderStyle, color: borderColor },
    right: { style: borderStyle, color: borderColor },
};
let PostClosingSummaryReport = class PostClosingSummaryReport {
    constructor(ProjectModel, ClientModel, VendorModel, ComplianceModel, MasterRequirementModel, TemplateModel, reportHelper) {
        this.ProjectModel = ProjectModel;
        this.ClientModel = ClientModel;
        this.VendorModel = VendorModel;
        this.ComplianceModel = ComplianceModel;
        this.MasterRequirementModel = MasterRequirementModel;
        this.TemplateModel = TemplateModel;
        this.reportHelper = reportHelper;
        this.groupByCoverageType = (complianceItems) => {
            const groupedItems = {};
            complianceItems.forEach(item => {
                const { coverage_type, waiver, post_closing } = item, rest = __rest(item, ["coverage_type", "waiver", "post_closing"]);
                if (!groupedItems[coverage_type]) {
                    groupedItems[coverage_type] = {
                        waiver_items: [],
                        post_closing_items: [],
                    };
                }
                if (waiver === true || typeof waiver === 'boolean') {
                    groupedItems[coverage_type].waiver_items.push(rest);
                }
                if (post_closing === true || typeof post_closing === 'boolean') {
                    groupedItems[coverage_type].post_closing_items.push(rest);
                }
            });
            return Object.entries(groupedItems).map(([coverage_type, { waiver_items, post_closing_items }]) => ({
                coverage_type,
                post_closing_items,
                waiver_items,
            }));
        };
    }
    async create(body) {
        var _a, _b, _c, _d;
        const compliance_items = [];
        const template_items = [];
        const postClosingSummarys = [];
        let { compliances, projects: projects } = await this.reportHelper.getCompliancesAndProjects({
            client_id: body.client_id,
            projectIdVendorIds: body.projectVendor,
        });
        [compliances, projects] = await this.reportHelper.advanceFilter(body, compliances, projects);
        if (projects.length !== 0) {
            for (const project of projects) {
                for (const comp of compliances) {
                    if (project._id.equals(comp.project_id)) {
                        for (const compliance of comp.compliance_items) {
                            const obj = {
                                coverage_type: ((_a = compliance.master_requirement) === null || _a === void 0 ? void 0 : _a.coverage_type_name) || '',
                                master_requirement_des: ((_b = compliance.master_requirement) === null || _b === void 0 ? void 0 : _b.requirement_description) || '',
                                required_limit: compliance.required_limit,
                                actual_limit: compliance.actual_limit,
                                comment: compliance.comment,
                                status: compliance.status,
                                waiver: compliance.waiver,
                                post_closing: compliance.post_closing,
                            };
                            compliance_items.push(obj);
                        }
                        for (const template of comp.template_items) {
                            const temp = await this.TemplateModel.findOne({
                                _id: template.template_id,
                                'rules._id': template.template_rule_id,
                            });
                            const rule = temp === null || temp === void 0 ? void 0 : temp.rules.find(rule => rule._id.equals(template.template_rule_id));
                            const obj = {
                                coverage_type: ((_c = template.master_requirement) === null || _c === void 0 ? void 0 : _c.coverage_type_name) || '',
                                master_requirement_des: ((_d = template.master_requirement) === null || _d === void 0 ? void 0 : _d.requirement_description) || '',
                                required_limit: rule ? `${rule.condition} ${rule.value}` : 'NA',
                                actual_limit: template.actual_limit,
                                comment: (rule === null || rule === void 0 ? void 0 : rule.message) || '',
                                status: template.status,
                                waiver: template.waiver,
                                post_closing: template.post_closing,
                            };
                            template_items.push(obj);
                        }
                    }
                }
                const post_closing_summary = {
                    project: project.name,
                    address: project.address_1 + ' ' + project.address_2,
                    items: this.groupByCoverageType([
                        ...compliance_items,
                        ...template_items,
                    ]),
                };
                postClosingSummarys.push(post_closing_summary);
            }
        }
        return postClosingSummarys;
    }
    async generateExcelFile(PCSJson) {
        const wb = XLSX.utils.book_new();
        const sheetName = PCSJson.project;
        const ws = XLSX.utils.json_to_sheet([], { header: [] });
        ws['!cols'] = [{ wch: 35 }, { wch: 35 }, { wch: 35 }, { wch: 35 }];
        ws['!rows'] = [{ hpx: 30 }, { hpx: 30 }];
        ws['!merges'] = [];
        ws['!rows'] = [];
        this.addProjectAndAddressHeader(ws, PCSJson.project, PCSJson.address);
        let currentRow = 3;
        PCSJson.items.forEach(item => {
            XLSX.utils.sheet_add_aoa(ws, [
                [
                    {
                        v: item.coverage_type,
                        t: 's',
                        s: {
                            alignment: {
                                wrapText: true,
                                vertical: 'center',
                                horizontal: 'center',
                            },
                            border: border,
                            h: 25,
                            color: { rgb: '000000' },
                            font: { sz: 12 },
                            fill: { fgColor: { rgb: 'FFFF00' } },
                        },
                    },
                ],
            ], {
                origin: `A${currentRow}`,
            });
            if (!ws['!merges']) {
                ws['!merges'] = [];
            }
            ws['!merges'].push({
                s: { r: currentRow - 1, c: 0 },
                e: { r: currentRow - 1, c: 3 },
            });
            currentRow += 1;
            XLSX.utils.sheet_add_aoa(ws, [
                [
                    {
                        v: 'POST CLOSING',
                        t: 's',
                        s: {
                            bold: true,
                            color: { rgb: '000000' },
                            font: { sz: 14 },
                            fill: { fgColor: { rgb: 'FFFFFF' } },
                        },
                    },
                ],
            ], {
                origin: `A${currentRow}`,
            });
            currentRow += 1;
            const styledHeaders = [
                'Requirements',
                'Required Limits',
                'Actual Limits',
                'Comment',
            ].map(item => ({
                v: item,
                t: 's',
                s: {
                    alignment: {
                        wrapText: true,
                    },
                    border: border,
                    color: { rgb: '000000' },
                    font: { sz: 12 },
                    fill: { fgColor: { rgb: 'D3D3D3' } },
                },
            }));
            XLSX.utils.sheet_add_aoa(ws, [styledHeaders], {
                origin: `A${currentRow}`,
            });
            currentRow += 1;
            item.post_closing_items.forEach(postClosingItem => {
                const styledRow = [
                    postClosingItem.master_requirement_des,
                    postClosingItem.required_limit,
                    postClosingItem.actual_limit,
                    postClosingItem.comment,
                ].map(item => ({
                    v: item,
                    t: 's',
                    s: {
                        alignment: {
                            wrapText: true,
                            horizontal: 'left',
                            vertical: 'top',
                        },
                        border: border,
                        color: { rgb: '000000' },
                        font: { sz: 12 },
                        fill: { fgColor: { rgb: 'FFFFFF' } },
                    },
                }));
                XLSX.utils.sheet_add_aoa(ws, [styledRow], { origin: `A${currentRow}` });
                if (!ws['!rows']) {
                    ws['!rows'] = [];
                }
                ws['!rows'][currentRow - 1] = { hpx: 50 };
                currentRow += 1;
            });
            XLSX.utils.sheet_add_aoa(ws, [
                [
                    {
                        v: 'WAIVER Items',
                        t: 's',
                        s: {
                            bold: true,
                            color: { rgb: '000000' },
                            font: { sz: 14 },
                            fill: { fgColor: { rgb: 'FFFFFF' } },
                        },
                    },
                ],
            ], {
                origin: `A${currentRow}`,
            });
            currentRow += 1;
            XLSX.utils.sheet_add_aoa(ws, [styledHeaders], {
                origin: `A${currentRow}`,
            });
            currentRow += 1;
            item.waiver_items.forEach(waiverItem => {
                const styledRow = [
                    waiverItem.master_requirement_des,
                    waiverItem.required_limit,
                    waiverItem.actual_limit,
                    waiverItem.comment,
                ].map(item => ({
                    v: item,
                    t: 's',
                    s: {
                        alignment: {
                            wrapText: true,
                            horizontal: 'left',
                            vertical: 'top',
                        },
                        border: border,
                        color: { rgb: '000000' },
                        font: { sz: 12 },
                        fill: { fgColor: { rgb: 'FFFFFF' } },
                    },
                }));
                XLSX.utils.sheet_add_aoa(ws, [styledRow], { origin: `A${currentRow}` });
                if (!ws['!rows']) {
                    ws['!rows'] = [];
                }
                ws['!rows'][currentRow - 1] = { hpx: 50 };
                currentRow += 1;
            });
            currentRow += 1;
        });
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
    addProjectAndAddressHeader(ws, project, address, rowHeight = 60) {
        const borderStyle = 'thin';
        const borderColor = { rgb: 'CFCFCF' };
        const border = {
            top: { style: borderStyle, color: borderColor },
            bottom: { style: borderStyle, color: borderColor },
            left: { style: borderStyle, color: borderColor },
            right: { style: borderStyle, color: borderColor },
        };
        XLSX.utils.sheet_add_aoa(ws, [
            [
                {
                    v: project,
                    t: 's',
                    s: {
                        alignment: {
                            horizontal: 'center',
                            vertical: 'center',
                            wrapText: true,
                            border: border,
                        },
                        h: rowHeight,
                        color: { rgb: '000000' },
                        font: { sz: 16, bold: true },
                        fill: { fgColor: { rgb: 'FFFFFF' } },
                    },
                },
            ],
        ], { origin: 'A1' });
        if (!ws['!merges']) {
            ws['!merges'] = [];
        }
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
        XLSX.utils.sheet_add_aoa(ws, [
            [
                {
                    v: address,
                    t: 's',
                    s: {
                        alignment: {
                            horizontal: 'center',
                            vertical: 'center',
                            wrapText: true,
                            border,
                        },
                        color: { rgb: '000000' },
                        font: { sz: 12 },
                        fill: { fgColor: { rgb: 'FFFFFF' } },
                    },
                },
            ],
        ], { origin: 'A2' });
        ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 3 } });
    }
};
PostClosingSummaryReport = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(project_model_1.ProjectModel.name)),
    __param(1, (0, mongoose_1.InjectModel)(client_model_1.ClientModel.name)),
    __param(2, (0, mongoose_1.InjectModel)(vendor_model_1.VendorModel.name)),
    __param(3, (0, mongoose_1.InjectModel)(compliance_model_1.ComplianceModel.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_requirement_model_1.MasterRequirementModel.name)),
    __param(5, (0, mongoose_1.InjectModel)(template_model_1.TemplateModel.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object, typeof (_f = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _f : Object, typeof (_g = typeof reportHelper_1.ReportHelper !== "undefined" && reportHelper_1.ReportHelper) === "function" ? _g : Object])
], PostClosingSummaryReport);
exports.PostClosingSummaryReport = PostClosingSummaryReport;
[];


/***/ }),
/* 169 */
/***/ ((module) => {

module.exports = require("xlsx-js-style");

/***/ }),
/* 170 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModule = void 0;
const common_1 = __webpack_require__(1);
const manager_1 = __webpack_require__(15);
const closingSummaryGridReport_service_1 = __webpack_require__(157);
const closingSummaryReport_service_1 = __webpack_require__(158);
const coiScheduleInsuranceReport_service_1 = __webpack_require__(160);
const complianceReviewReport_service_1 = __webpack_require__(162);
const dealSummaryReport_service_1 = __webpack_require__(164);
const fullComplianceReport_service_1 = __webpack_require__(165);
const nonComplianceReport_service_1 = __webpack_require__(166);
const policyExpirationReport_service_1 = __webpack_require__(167);
const postClosingSummaryReport_service_1 = __webpack_require__(168);
const report_manager_service_1 = __webpack_require__(156);
const reportHelper_1 = __webpack_require__(159);
const reportProviders = [
    fullComplianceReport_service_1.FullComplianceReport,
    nonComplianceReport_service_1.NonComplianceReport,
    dealSummaryReport_service_1.DealSummaryReport,
    closingSummaryReport_service_1.ClosingSummaryReport,
    policyExpirationReport_service_1.PolicyExpirationReport,
    complianceReviewReport_service_1.ComplianceReviewReport,
    coiScheduleInsuranceReport_service_1.CoiScheduleInsuranceReport,
    closingSummaryGridReport_service_1.ClosingSummaryGridReport,
    postClosingSummaryReport_service_1.PostClosingSummaryReport,
];
let ReportsModule = class ReportsModule {
};
ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [manager_1.ManagerModule],
        providers: [report_manager_service_1.ReportManagerService, reportHelper_1.ReportHelper, ...reportProviders],
        exports: [report_manager_service_1.ReportManagerService, ...reportProviders],
    })
], ReportsModule);
exports.ReportsModule = ReportsModule;


/***/ }),
/* 171 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportController = void 0;
const common_1 = __webpack_require__(1);
const decorators_1 = __webpack_require__(172);
const swagger_1 = __webpack_require__(3);
const ReportCreator_1 = __webpack_require__(173);
const reports_1 = __webpack_require__(155);
const express_1 = __webpack_require__(174);
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    async getSampleExcel(body, res) {
        const result = await this.reportService.create(Object.assign(Object.assign({}, body), { report: 'excel_test' }));
        res.setHeader('Content-Disposition', `attachment; filename="${body.report}_Report.xls"`);
        return res
            .contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' +
            ';charset=utf-8')
            .status(common_1.HttpStatus.OK)
            .send(result.data);
    }
    async create(body, res) {
        var _a;
        try {
            const reportFile = await this.reportService.create(body);
            const contentType = reportFile.type === 'html'
                ? 'text/html'
                : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' +
                    ';charset=utf-8';
            if (reportFile.type === 'excel') {
                res.setHeader('Content-Disposition', 'attachment; filename="report.xls"');
            }
            return res
                .contentType(contentType)
                .status(common_1.HttpStatus.OK)
                .send(reportFile.data);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, (_a = error.statusCode) !== null && _a !== void 0 ? _a : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, decorators_1.Get)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof ReportCreator_1.ReportCreator !== "undefined" && ReportCreator_1.ReportCreator) === "function" ? _b : Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getSampleExcel", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof ReportCreator_1.ReportCreator !== "undefined" && ReportCreator_1.ReportCreator) === "function" ? _d : Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "create", null);
ReportController = __decorate([
    (0, swagger_1.ApiTags)('Report'),
    (0, common_1.Controller)('report'),
    __metadata("design:paramtypes", [typeof (_a = typeof reports_1.ReportManagerService !== "undefined" && reports_1.ReportManagerService) === "function" ? _a : Object])
], ReportController);
exports.ReportController = ReportController;


/***/ }),
/* 172 */
/***/ ((module) => {

module.exports = require("@nestjs/common/decorators");

/***/ }),
/* 173 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportCreator = exports.ProjectVendor = void 0;
const classes_1 = __webpack_require__(21);
const swagger_1 = __webpack_require__(3);
const class_transformer_1 = __webpack_require__(23);
const class_validator_1 = __webpack_require__(24);
const mongodb_1 = __webpack_require__(25);
class ProjectVendor {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'must be a valid project id' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", typeof (_a = typeof mongodb_1.ObjectId !== "undefined" && mongodb_1.ObjectId) === "function" ? _a : Object)
], ProjectVendor.prototype, "project_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'must be a valid vendor id' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayUnique)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], ProjectVendor.prototype, "vendor_id", void 0);
exports.ProjectVendor = ProjectVendor;
class ReportCreator {
}
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReportCreator.prototype, "client_id", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProjectVendor),
    __metadata("design:type", Array)
], ReportCreator.prototype, "projectVendor", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ReportCreator.prototype, "coverage_type", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreator.prototype, "insurance_co", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreator.prototype, "client_stage", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreator.prototype, "broker", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreator.prototype, "closing_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReportCreator.prototype, "start_date", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)([
        'compliance_review_report',
        'full_compliance_report',
        'non_compliance_report',
        'closing_summary_brief',
        'closing_summary_grid',
        'coi_schedule_of_insurance',
        'deal_summary_report',
        'policy_expiration_report',
        'excel_test',
        'expiration_report',
        'post_closing_summary',
        'excalation_report',
    ], {
        message: 'report value must be one of the allowed report types',
    }),
    __metadata("design:type", String)
], ReportCreator.prototype, "report", void 0);
exports.ReportCreator = ReportCreator;


/***/ }),
/* 174 */
/***/ ((module) => {

module.exports = require("express");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(3);
const winstonLogger_1 = __webpack_require__(4);
const helmet_1 = __webpack_require__(6);
const morgan = __webpack_require__(7);
const als_reporting_module_1 = __webpack_require__(8);
async function bootstrap() {
    const app = await core_1.NestFactory.create(als_reporting_module_1.AlsReportingModule);
    app.use((0, helmet_1.default)());
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('ALS-REPORTING')
        .setDescription('API Docs')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    app.use(morgan('common'));
    (0, winstonLogger_1.initWinston)('apps/als-reporting/logs');
    await app.listen(process.env.PORT || 3002);
}
bootstrap();

})();

/******/ })()
;