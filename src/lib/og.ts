export async function loadGoogleFont(family: string, weight: number, text: string) {
  const query = `family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((response) =>
    response.text(),
  )
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
  if (!url) throw new Error(`Google Fonts did not return ${family} ${weight}`)
  return fetch(url).then((response) => response.arrayBuffer())
}
