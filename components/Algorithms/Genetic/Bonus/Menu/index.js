import style from "./style.module.scss";
import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu() {
    return (
        <MenuWrapper
            className={style.menu}
            title="Генетический алгоритм"
            description="Сейчас вы узрите, как выполняется генерация кода для вывода последовательности Фибоначчи."
        >
            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={() => {}}
                >
                    Запустить алгоритм
                </Button>

                <Button
                    type="soft"
                    onClick={() => {}}
                >
                    Отменить
                </Button>
            </ButtonContainer>
        </MenuWrapper>
    );
}
