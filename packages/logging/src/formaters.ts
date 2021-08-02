import { IRecord, IFormater } from './types';

const pad = (len: number, num: number | string, char = '0') => {
    num = `${num}`;
    len = len - num.length;
    while (len > 0) {
      num = `${char}${num}`;
      len -= 1;
    }
    return num;
};
const pad10 = (num: number) => pad(2, num);
const pad100 = (num: number) => pad(3, num);

type TFormaters = {
    [key: string]: (obj: any) => string;
};

export const DEFAULT_FORMATERS: TFormaters = {
    created(created: Date) {
        return [
          created.getUTCFullYear(),
          '-',
          pad10(created.getUTCMonth()+1),
          '-',
          pad10(created.getUTCDate()),
          'T',
          pad10(created.getUTCHours()),
          ':',
          pad10(created.getUTCMinutes()),
          ':',
          pad10(created.getUTCSeconds()),
          '.',
          pad100(created.getUTCMilliseconds()),
          'Z',
      ].join('');
    }
};

const DEFAULT_TEMPLATE = '{created}|{levelName}|{name}|{msg}{exception}';

export class SimpleFormater implements IFormater {
    static FULL = DEFAULT_TEMPLATE;
    static BASIC = "{levelName}|{name}|{msg}{exception}";
    static MINIMAL = "{msg}{exception}";

    constructor(
        private template: string = DEFAULT_TEMPLATE,
        private formaters: TFormaters = DEFAULT_FORMATERS
) {}

    format(record: IRecord): string {
        return this.template.replace(/\{(.+?)\}/g, (_, name) => {
            return this.getFormatted(record, name);
        });
    }
    getFormatted(record: IRecord, name: string): string {
        const value = record[name];
        if (value === undefined) {
            return '';
        }
        const method = this.formaters[name];
        return method ? method(value) : value;
    }
}