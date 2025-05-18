import Navbar from '../components/navbar';
import { CardQuizList } from '../components/CardQuiz';

const Examenes = () => {
    return (
        <div className="bg-gradient-primary">
            <Navbar />
            <main className="pt-25 min-h-screen container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">
                    Mis Exámenes
                </h1>
                <CardQuizList />
            </main>
        </div>
    );
};

export default Examenes;