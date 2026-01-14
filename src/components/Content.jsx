import { useState } from "react";

import acikresim from "../assets/weather/clear.jpg";
import bulutluresim from "../assets/weather/clouds.jpg";
import yagmurluresim from "../assets/weather/rain.webp";
import karliresim from "../assets/weather/snow.jpg";

import acikikon from "../assets/icons/clear.png";
import bulutluikon from "../assets/icons/clouds.png";
import yagmurluikon from "../assets/icons/rain.png";
import karliikon from "../assets/icons/snow.png";

function Content() {
    const [sehir, setSehir] = useState("");
    const [hava, setHava] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [sarki, setSarki] = useState(null);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [error, setError] = useState("");

    // Hava durumuna göre ayarlanacaklar listesi

    const weatherConfig = {
        Clear: {
            text: "Açık",
            icon: acikikon,
            bg: acikresim,
            songs: [
                "Billy Cobham and Asere - Hoja, Ontoño y Flor",
                "Yes - Changes",
                "Vodka Cranberry - Conan Gray",
                "Body and Mind - girl in red",
                "Elf - Ado",
                "Fleeting Lullaby - Ado",
                "Zoltraak - Evan Call",
                "Good Goodbye - HWASA",
                "Mars 2027 - Ichiko Aoba",
                "Porcelain - Ichiko Aoba"
            ]
        },
        Clouds: {
            text: "Bulutlu",
            icon: bulutluikon,
            bg: bulutluresim,
            songs: [
                "Inertia - Cö Shu Nie",
                "Wage of Guilt - Cö Shu Nie",
                "Dignity - Ado",
                "Deftones - Pink Maggite",
                "A Perfect Circle - Orestes",
                "Slow Dancing in a Burning Room",
                "Liquid Smooth - Mitski",
                "For Lovers - Lamp",
                "I Love Me After You - Mitski",
                "Tokyo - Kinokoteikoku"
            ]
        },
        Rain: {
            text: "Yağmurlu",
            icon: yagmurluikon,
            bg: yagmurluresim,
            songs: [
                "Kikaijikake No Ucyuu - Ichiko Aoba",
                "Kirinaki Shima - Ichiko Aoba",
                "Glassy Sky - Yutaka Yamada",
                "Dear Alice(Rainy Days) - arai tasuku",
                "Shoka - Ado",
                "King Crimson - In The Wake Of Posedion",
                "Dream Theater - Space-Dye Vest",
                "Can't Pretend - Tom Odell",
                "Fool - Boa",
                "Musician - Kinokoteikoku"
            ]
        },
        Snow: {
            text: "Karlı",
            icon: karliikon,
            bg: karliresim,
            songs: [
                "Sweater Weather - The Neighbourhood",
                "Gira Gira - Ado",
                "Memories - Yutaka Yamada",
                "So Ist Es Immer - Sawano Hirayuki",
                "The Dale Cooper Quartet - Elle Agréable Rendez-Vous De Chasse",
                "Julee Cruise - Into The Night",
                "Wildflower - Billie Eilish",
                "Snowman - Sia",
                "Lovely - Billie Eilish",
                "Dilemma - Shiori Shinomiya"
            ]
        }
    };

    //Yardımcı İşlemler

    const getRandomSarki = (songs) => {
        const index = Math.floor(Math.random() * songs.length);
        return songs[index];
    };

    const getGunadi = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("tr-TR", { weekday: "short" });
    };

    const renderWeatherLine = (weatherType) => {
        const config = weatherConfig[weatherType];
        if (!config) return null;

        return (
            <div className="weather-line">
                <img src={config.icon} alt="weather icon" />
                <span>{config.text}</span>
            </div>
        );
    };

    // API

    const getHava = () => {
        if (!sehir) return;

        setYukleniyor(true);
        setError("");
        setHava(null);
        setForecast([]);
        setSarki(null);

        //Bugün
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${sehir}&appid=7750112754efb486424d4ec7e6c0e599&units=metric`
        )
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => {
                setHava(data);

                const type = data.weather[0].main;
                const config = weatherConfig[type];

                if (config?.bg) {
                    document.body.style.backgroundImage = `url(${config.bg})`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                }

                if (config?.songs) {
                    setSarki(getRandomSarki(config.songs));
                }
            });

        //5 günlük tahmin
        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${sehir}&appid=7750112754efb486424d4ec7e6c0e599&units=metric`
        )
            .then((res) => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then((data) => {
                const dailyData = {};

                data.list.forEach((item) => {
                    const date = item.dt_txt.split(" ")[0];
                    if (!dailyData[date]) {
                        dailyData[date] = item;
                    }
                });

                const today = new Date().toISOString().split("T")[0];

                const dailyArray = Object.values(dailyData)
                    .filter(day => day.dt_txt.split(" ")[0] !== today)
                    .slice(0, 5);

                setForecast(dailyArray);
                setYukleniyor(false);
            })
            .catch(() => {
                setError("Bu isimde bir şehir bulunamadı!");
                setYukleniyor(false);
            });
    };

    //Ekran çıktısı

    return (
        <>

            <input
                type="text"
                placeholder="Şehir giriniz"
                value={sehir}
                onChange={(e) => setSehir(e.target.value)}
            />
            <button onClick={getHava}>Ara</button>

            {yukleniyor && <p className="loading">Yükleniyor...</p>}
            {error && <p className="error">{error}</p>}


            {hava && (
                <div className="bugun-card">
                    <div className="bugun-hava">
                        <h2>{hava.name}</h2>
                        <p>{hava.main.temp} °C</p>
                        {renderWeatherLine(hava.weather[0].main)}
                    </div>

                    <div className="ayirici"></div>

                    <div className="bugun-muzik">
                        <p className="muzik-adi">🎵 Günün Şarkısı</p>
                        <strong>{sarki}</strong>
                    </div>
                </div>
            )}

        
           
            {forecast.length > 0 && (
                   <h2 className="forecast-title">5 Günlük Hava Tahmini
                <div className="row justify-content-center g-3">
                    {forecast.map((day, index) => (
                        <div
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                            key={index}
                        >
                            <div className="card h-100">
                                <h3>{getGunadi(day.dt_txt)}</h3>
                                <p>{Math.round(day.main.temp)} °C</p>
                                {renderWeatherLine(day.weather[0].main)}
                            </div>
                        </div>
                    ))}
                </div>
                </h2>

            )}
        </>
    );
}

export default Content;
