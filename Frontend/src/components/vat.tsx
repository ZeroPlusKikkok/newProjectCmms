type Prop = {
  price: number
  rate: number
}

export default function VatResult({price, rate}: Prop) {
  return (
    <>
      {price+(price*rate/100)}
    </>
  )  
}