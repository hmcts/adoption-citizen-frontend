import * as idamServiceMock from 'test/http-mocks/idam/idam';
import { defaultAccessToken } from 'test/http-mocks/idam/idam';

idamServiceMock.resolveAuthToken(defaultAccessToken);
idamServiceMock.resolveRetrieveUserFor('123','citizen').persist();
