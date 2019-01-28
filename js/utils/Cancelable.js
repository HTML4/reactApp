
export default function makeCancelable(promise){
  let hasCanceled_ = false
  const warppePromise = new Promise((resolve, reject) => {
    promise.then((val) => {
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    })
    promise.catch((error) => {
      hasCanceled_ ? reject({isCanceled: true}) : resolve(error)
    })
  })
  return {
    pormise: warppePromise,
    cancel() {
      hasCanceled_ = true
    }
  }
}
