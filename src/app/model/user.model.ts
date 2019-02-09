export class User {
   constructor(
      public id?: number,
      public first_name?: string,
      public last_name?: string,
      public father_name?: string,
      public b_day_date?: object,
      public work_start_date?: object,
      public role?: string,
      public manager_dependence?: number,
      public dependentList?: Array<Number>,
      public description?: string
   ) { }
}