import axios from 'axios';
import { deviceId } from '../../constants';

const sysFetch = (api, data, config) => {
    return axios
        .post(
            api + 'Exec/ExecNoAuth/',
            // api + 'Exec/ExecNoAuth/',
            {
                ...data,
                machine_id: deviceId,
                token: 'tvs',
                schema: config.schema,
                site: config.site,
                obj: config.obj,
            },
        )
        .then(response => {
            //console.log('response.data: ', response);
            return response.data;
        })
        .catch(err => {
            if (err == 'AxiosError: Request failed with status code 401') {
                return 'Token Expired';
            } else {
                console.log('err sysFetch');
                console.log(err);
            }
        });
};
export default sysFetch;
