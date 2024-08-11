import style from './ticket.module.scss'
import ticket from '../../public/alap.png'
import base from '../../public/kaparas.png'
import poszto from '../../public/poszto.png'
import { useEffect, useState } from 'react'

/**
 * Megjegyzések:
 * - a kaparás megvalósításához ScratchCard-js-t akartam használni, de egy appendchildos hibába futottam
 * és nem találtam rá megoldást a package issuek között ezért nem akartam időt tölteni vele és ez a
 * kezdetleges kaparás maradt
 * - figmában nem találtam olyan elemet ami egyben a lekaparható felületet mutatja (bár ez lehet az én hibám)
 * ezért van egy pici kilátszó rész aminek a takarásával nem foglalkoztam
 * - a lekaparható felület felbontása borzalmas, de csak így tudtam működésre bírni ebben a megoldásban, funkciójának
 * megfelelően működik
 */

const Ticket = () => {
  const [prize, setPrize] = useState({ value: '10000 Ft', label: 'tizezer' })
  const [dealer, setDealer] = useState({ value: '17', label: 't.hét' })
  const [playerFirst, setPlayerFirst] = useState({ value: '17', label: 't.hét' })
  const [playerSecond, setPlayerSecond] = useState({ value: '17', label: 't.hét' })
  const [playerThird, setPlayerThird] = useState({ value: '17', label: 't.hét' })
  const [playerFourth, setPlayerFourth] = useState({ value: '17', label: 't.hét' })
  const [bonus, setBonus] = useState([
    { value: '17', label: 't.hét' },
    { value: '4', label: 'négy' },
    { value: '2', label: 'kettő' }
  ])

  useEffect(() => {
    firstRender()
  }, [])

  const firstRender = () => {
    const canvas = document.getElementById('scratch')
    const context = canvas.getContext('2d')

    const initializeCanvas = () => {
      const img = new Image()
      img.src = '/poszto.png'
      img.onload = () => {
        context.drawImage(img, 0, 0, 300, 150)
      }

      // esély generálás
      const chance = Math.random()
      const bonusChance = Math.random()
      let values = []
      let bonus = []
      let dealer = []
      let max = 0

      const getRandomNumberBetweenIncluding = (min, max) => {
        const number = Math.floor(Math.random() * (max - min + 1)) + min

        return number
      }

      const randomNumbersWithFixedSum = (quantity, sum) => {
        if (quantity === 1) {
          return [sum]
        }
        const randomNum = getRandomNumberBetweenIncluding(1, sum - 2)
        return [randomNum, ...randomNumbersWithFixedSum(quantity - 1, sum - randomNum)]
      }

      const generateWinnerValues = () => {
        for (let i = 0; i < 4; i++) {
          values.push(getRandomNumberBetweenIncluding(1, 21))
        }
        max = Math.max(...values)
        dealer = getRandomNumberBetweenIncluding(1, max - 1)
      }

      const generateLoserValues = () => {
        for (let i = 0; i < 4; i++) {
          values.push(getRandomNumberBetweenIncluding(1, 20))
        }
        max = Math.max(...values)
        dealer = getRandomNumberBetweenIncluding(max + 1, 21)
      }

      if (chance < 0.3) {
        setPrize({ value: '500 Ft', label: 'ötszáz' })
        generateWinnerValues()
      } else if (0.3 < chance < 0.55) {
        setPrize({ value: '1000 Ft', label: 'ezer' })
        generateWinnerValues()
      } else if (0.55 < chance < 0.7) {
        setPrize({ value: '5000 Ft', label: 'ötezer' })
        generateWinnerValues()
      } else if (0.7 < chance < 0.8) {
        setPrize({ value: '10000 Ft', label: 'tízezer' })
        generateWinnerValues()
      } else if (0.8 < chance < 0.85) {
        setPrize({ value: '10000Ft Ft', label: 'százezer' })
        generateWinnerValues()
      } else {
        generateLoserValues()
      }

      if (bonusChance < 0.5) {
        bonus = randomNumbersWithFixedSum(3, 21)
      } else {
        bonus = randomNumbersWithFixedSum(3, 20)
      }

      const labelOptions = [
        'egy',
        'kettő',
        'három',
        'négy',
        'öt',
        'hat',
        'hét',
        'nyolc',
        'kilenc',
        'tíz',
        't.egy',
        't.kettő',
        't.három',
        't.négy',
        't.öt',
        't.hat',
        't.hét',
        't.nyolc',
        't.kilenc',
        'húsz',
        'h.egy',
        'h.kettő',
        'h.három',
        'h.négy',
        'h.öt',
        'h.hat',
        'h.hét'
      ]

      setPlayerFirst({ value: values[0], label: labelOptions[values[0] - 1] })
      setPlayerSecond({ value: values[1], label: labelOptions[values[1] - 1] })
      setPlayerThird({ value: values[2], label: labelOptions[values[2] - 1] })
      setPlayerFourth({ value: values[3], label: labelOptions[values[3] - 1] })
      setDealer({ value: dealer, label: labelOptions[dealer - 1] })
      setBonus([
        { value: bonus[0], label: labelOptions[bonus[0] - 1] },
        { value: bonus[1], label: labelOptions[bonus[1] - 1] },
        { value: bonus[2], label: labelOptions[bonus[2] - 1] }
      ])
    }

    const init = () => {
      let mouseX = 0
      let mouseY = 0
      let isDragged = false

      let events = {
        mouse: {
          down: 'mousedown',
          move: 'mousemove',
          up: 'mouseup'
        },
        touch: {
          down: 'touchstart',
          move: 'touchmove',
          up: 'touchend'
        }
      }

      let deviceType = ''

      const isTouchDevice = () => {
        try {
          document.createEvent('TouchEvent')
          deviceType = 'touch'
          return true
        } catch (e) {
          deviceType = 'mouse'
          return false
        }
      }

      let rectLeft = canvas.getBoundingClientRect().left
      let rectTop = canvas.getBoundingClientRect().top

      const getXY = (e) => {
        mouseX = (!isTouchDevice() ? e.pageX : e.touches[0].pageX) - rectLeft
        mouseY = (!isTouchDevice() ? e.pageY : e.touches[0].pageY) - rectTop
      }

      isTouchDevice()
      canvas.addEventListener(events[deviceType].down, (event) => {
        isDragged = true
        getXY(event)
        scratch(mouseX, mouseY)
      })

      canvas.addEventListener(events[deviceType].move, (event) => {
        if (!isTouchDevice()) {
          event.preventDefault()
        }
        if (isDragged) {
          getXY(event)
          scratch(mouseX, mouseY)
        }
      })

      canvas.addEventListener(events[deviceType].up, () => {
        isDragged = false
      })

      canvas.addEventListener('mouseleave', () => {
        isDragged = false
      })

      const scratch = (x, y) => {
        context.globalCompositeOperation = 'destination-out'
        context.beginPath()
        context.arc(x, y, 12, 0, 2 * Math.PI)
        context.fill()
      }
    }
    initializeCanvas()
    init()
  }

  return (
    <div className={style.ticket}>
      <div className={style.background}>
        <img src={ticket} alt="" />
      </div>
      <div className={style.base}>
        <img src={poszto} alt="" />
      </div>
      <div className={style.table}>
        <img src={base} alt="" />
      </div>
      <div className={style.dealer}>
        <div className={style.prizeNumber}>{prize.value}</div>
        <div className={style.prizeLabel}>{prize.label}</div>
        <div className={style.dealerNumber}>{dealer.value}</div>
        <div className={style.dealerLabel}>{dealer.label}</div>
      </div>
      <div className={style.player}>
        <div className={style.playerUp}>
          <div className={style.number}>
            <p>{playerFirst.value}</p> <p>{playerFirst.label}</p>
          </div>
          <div className={style.number}>
            <p>{playerSecond.value}</p> <p>{playerSecond.label}</p>
          </div>
        </div>
        <div className={style.playerDown}>
          <div className={style.number}>
            <p>{playerThird.value}</p> <p>{playerThird.label}</p>
          </div>
          <div className={style.number}>
            <p>{playerFourth.value}</p> <p>{playerFourth.label}</p>
          </div>
        </div>
      </div>
      <div className={style.bonus}>
        <p className={style.text}>bónusz-játék</p>
        {bonus.map((data) => (
          <div className={style.number}>
            <p>{data.value}</p>
            <p>{data.label}</p>
          </div>
        ))}
      </div>
      <canvas className={style.canvas} id="scratch"></canvas>
    </div>
  )
}

export default Ticket
