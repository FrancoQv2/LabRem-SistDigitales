import jwt from 'jsonwebtoken';        //Manejo de Tokens

const validacionController = {};
validacionController.verificar = (req, res, next) => {
    const tokenH = req.headers['authorization'];
    const {datos} = req.body;
    if (tokenH) {
        const token = tokenH.split(' ')[1];
        jwt.verify(token,'-----BEGIN PUBLIC KEY-----\n'+
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoZ3BASVIM6zyqgomqZIK\n'+
        'G2iohA35/hiODnO70DFIL2Lz/rUCz8rGBptmCvuB6sBthsTl/H59z+BhJUMttLEB\n'+
        'FFovkeuT/I+UYwH8bppWgI8gmPm2oTjQ+b+AUhTQdBWu8Y00GtvXk1AK40+uK8by\n'+
        'muRQwYZF62Omwcp/R5uqcfNzTzXhlVCqQFvjUy/bMtOX5fWZSYUNTP6wQnVODi5K\n'+
        '2FitZ5a9gVYFIRCMwy0hCtNH9KifKv8+D5xTT8lhb0VCHFgGn0nRPUq3bpoZJbnb\n'+
        '3KsWTgUR2Nsb0Y8M8RFLhnViY1IBoytzkU0vVcIAhPELJ22HeLld6YXByKS4k022\n'+
        'SQIDAQAB\n'+
        '-----END PUBLIC KEY-----',{algorithm:['RS256']},(err, decoded) => {
            if (err) {
               console.error('JWT verified fail: ',err);
               return res.status(403).json("Token no válido");
            } 
                // console.log('JWT verified successfully: ', decoded);
                if (datos) {
                    return res.status(200).json(decoded);
                }
                console.log(datos) 
                next();
        });
    } else {
        return res.status(401).json({ message: 'Token no válido', redirectTo: '/login' });
    }
  };

export { validacionController };