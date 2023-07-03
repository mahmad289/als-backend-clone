import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserAssignedToRequest } from 'als/auth-manager/jwt.interface';
import { GetUser } from 'als/building-block/decorators/get-user-decorator';
import { ParamIdDto } from 'als/building-block/RequestableDto/params.dto';
import { MaterialDocumentAndCertificateUpdate } from 'als/building-block/RequestableDto/Project/MaterialDocsCertsUpdate';
import { ProjectCreator } from 'als/building-block/RequestableDto/Project/ProjectCreator';
import { ProjectDocsUpdateDto } from 'als/building-block/RequestableDto/Project/ProjectDocsUpdate';
import { ProjectAdditionalInsuredUpdateDto } from 'als/building-block/RequestableDto/Project/ProjectInsuredUpdate';
import {
  AssignedVendor,
  ContactUpdate,
  ProjectContactUpdate,
  ProjectIds,
  ProjectNotesUpdate,
  ProjectUpdate,
  ProjectWaiverUpdate,
  UnAssignedVendor,
} from 'als/building-block/RequestableDto/Project/ProjectUpdate';
import { SearchableDto } from 'als/building-block/RequestableDto/searchable.dto';
import { ServiceError } from 'als/building-block/utils/apiError';
import { IProjectService } from 'als/manager/project/project-service';

@ApiBearerAuth()
@ApiTags('Project')
@Controller('project')
export class ProjectsController {
  constructor(private projectService: IProjectService) {}

  @Get()
  async findAll(@Query() query: SearchableDto) {
    try {
      return await this.projectService.getAll(query);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Get(':id')
  async findById(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      const res = await this.projectService.getById(param.id);
      if (!res) {
        throw new ServiceError('Project not found', HttpStatus.NOT_FOUND);
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Client Id',
  })
  @Get('client/:id')
  async findByClientId(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.projectService.getByClientId(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  async create(@Body() projectCreatePayload: ProjectCreator) {
    try {
      return await this.projectService.create(projectCreatePayload);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Patch(':id')
  async update(
    @Param()
    param: ParamIdDto,
    @Body() projectPayload: ProjectUpdate,
  ) {
    try {
      const res = await this.projectService.update(param.id, projectPayload);
      if (!res) {
        throw new ServiceError(
          'Failed To Update Project',
          HttpStatus.NOT_FOUND,
        );
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Patch('update-notes/:id')
  async updateNotes(
    @Param()
    param: ParamIdDto,
    @Body() projectNotesPayload: ProjectNotesUpdate,
  ) {
    try {
      return await this.projectService.updateNotes(
        param.id,
        projectNotesPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Patch('update-waiver/:id')
  async updateWaiver(
    @Param()
    param: ParamIdDto,
    @Body() projectWaiverPayload: ProjectWaiverUpdate,
  ) {
    try {
      return await this.projectService.updateWaiver(
        param.id,
        projectWaiverPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Patch('assign-vendor/:id')
  async addVendorAssignment(
    @Param()
    param: ParamIdDto,
    @Body() vendorAssignmentPayload: AssignedVendor,
    @GetUser() user: UserAssignedToRequest,
  ) {
    try {
      return await this.projectService.addVendorAssignment(
        param.id,
        vendorAssignmentPayload,
        user,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Patch('unassign-vendor/:id')
  async removeVendorAssignment(
    @Param()
    param: ParamIdDto,
    @Body() vendorAssignmentPayload: UnAssignedVendor,
  ) {
    try {
      return await this.projectService.removeVendorAssignment(
        param.id,
        vendorAssignmentPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('material-docs-certs/:id')
  async updateMaterialDocsAndCerts(
    @Param()
    param: ParamIdDto,
    @Body() materialDocsAndCertPayload: MaterialDocumentAndCertificateUpdate,
  ) {
    try {
      const res = await this.projectService.updateMaterialDocsAndCerts(
        param.id,
        materialDocsAndCertPayload,
      );

      if (!res) {
        throw new ServiceError(
          'Failed To Update Project Material Docs&Certs',
          HttpStatus.NOT_FOUND,
        );
      }

      return res;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Patch('assign-contact/:id')
  async ContactAssignment(
    @Param()
    param: ParamIdDto,
    @Body() contactAssignmentPayload: ContactUpdate,
  ) {
    try {
      return await this.projectService.contactAssignment(
        param.id,
        contactAssignmentPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give Project Id',
  })
  @Patch('remove-contact/:id')
  async removeContactAssignment(
    @Param()
    param: ParamIdDto,
    @Body() removeContactPayload: ContactUpdate,
  ) {
    try {
      return await this.projectService.removeContactAssignment(
        param.id,
        removeContactPayload,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('assigned-contacts')
  async findAssignedContacts(
    @Body()
    projectIds: ProjectIds,
  ) {
    try {
      return await this.projectService.getAssignedContacts(projectIds);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give contact id',
  })
  @Patch(':id/assign-contact')
  async assignContact(
    @Param()
    param: ParamIdDto,
    @Body() contactUpdatePayloadDto: ProjectContactUpdate,
  ) {
    try {
      return await this.projectService.assignContacts(
        param.id,
        contactUpdatePayloadDto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiParam({
    name: 'id',
    description: 'Give vendor id',
  })
  @Get('vendor/:id')
  async getVendorProjects(
    @Param()
    param: ParamIdDto,
  ) {
    try {
      return await this.projectService.getVendorProjects(param.id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // -----------------

  @ApiParam({
    name: 'id',
    description: 'project id',
  })
  @Patch('update-document/:id')
  async updateProjectDocuments(
    @Param()
    param: ParamIdDto,
    @Body()
    body: ProjectDocsUpdateDto,
  ) {
    try {
      return await this.projectService.updateProjectDocuments(param.id, body);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //--------------
  @ApiParam({
    name: 'id',
    description: 'project id',
  })
  @Patch('additional-insured/:id')
  async updateAdditionalInsured(
    @Param()
    param: ParamIdDto,
    @Body()
    body: ProjectAdditionalInsuredUpdateDto,
  ) {
    try {
      return await this.projectService.updateAdditionalInsured(param.id, body);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
