import hive from '@hiveio/hive-js';
export function check_user(){

    
    hive.api.getAccountsAsync(["firedream"]).then(r => {
        console.log(r);
        return [r];
      });
    
}
