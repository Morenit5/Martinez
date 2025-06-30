/// ColumnNumericTransformer
export class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {

    //trycatch revisar si falla el  parseFloat
    try
    {
      return parseFloat(data);
    }
    catch (error)
    {
      console.log(error);
      return 0;
    }
  }
}