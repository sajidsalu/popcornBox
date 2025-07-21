import './PopcornLoader.css';
import Popccorn from '../../assets/popcorn.png';

const PopcornLoader = () => {
    return (
        <div className="popcorn-loader">
            <img src={Popccorn} alt="Popcorn" className="popcorn bounce delay-0" />
            <img src={Popccorn} alt="Popcorn" className="popcorn bounce delay-1" />
            <img src={Popccorn} alt="Popcorn" className="popcorn bounce delay-2" />
        </div>
    );
};

export default PopcornLoader;
