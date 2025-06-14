import globalConfig from '../config/global.config';

export default function onServerInit(err?: Error): void {
    if (err) throw new Error('SERVER INIT ERROR | ' + err.message);

    return console.log(`Server running on http://localhost:${globalConfig.PORT}`);
};