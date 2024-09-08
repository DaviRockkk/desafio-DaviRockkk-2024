class RecintosZoo {
    constructor() {
        // dados dos recintos
        this.recintos = [
            {numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: {macaco: 3}},
            {numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: {}},
            {numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: {gazela: 1}},
            {numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: {}},
            {numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: {leao: 1}},
        ]
        // dados dos animais
        this.animais = {
            leao: {tamanho: 3, bioma: 'savana'},
            leopardo: {tamanho: 2, bioma: 'savana'},
            crocodilo: {tamanho: 3, bioma: 'rio'},
            macaco: {tamanho: 1, bioma: ['savana', 'floresta']},
            gazela: {tamanho: 2, bioma: 'savana'},
            hipopotamo: {tamanho: 4, bioma: ['savana', 'rio']},
        }
    }
    // remover os acentos
    removerAcentos(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }
    // validar animal
    validarAnimal(animal) {
        return this.animais.hasOwnProperty(this.removerAcentos(animal).toLowerCase());
    }
    // validar quantidade
    validarQuantidade(quantidade) {
        return Number.isInteger(quantidade) && quantidade > 0;
    }
    // calcular o espaço livre do recinto
    calculaEspaçoLivre(tamanhoTotal, animaisExistentes, tamanhoAnimal) {
        const espaçoOcupado = Object.values(animaisExistentes).reduce((acc, count) => acc + count * tamanhoAnimal, 0);
        return tamanhoTotal - espaçoOcupado;
    }
    
    // analisar or recintos
    analisaRecintos(animal, quantidade) {
        // processando as entradas
        const animalV = this.removerAcentos(animal.trim().toLowerCase());
        // validando as entradas
        if (!this.validarAnimal(animalV)) {
            return {erro: "Animal inválido"};
        }
        if (!this.validarQuantidade(quantidade)) {
            return {erro: "Quantidade inválida"};
        }

        const animaisDados = this.animais[animalV];
        const recintosViaveis = [];

        // verifica se o bioma é compatível
        for (const recinto of this.recintos) {
            const biomas = animaisDados.bioma;
            if (typeof biomas === 'string') {
                if (!recinto.bioma.includes(biomas)) continue;
            } else if (!biomas.some(bioma => recinto.bioma.includes(bioma))) {
                continue;
            }

            // calcula o espaço disponível
            const tamanhoAnimal = animaisDados.tamanho;
            const tamanhoLivre = this.calculaEspaçoLivre(recinto.tamanhoTotal, recinto.animaisExistentes, tamanhoAnimal);

            // calcula o espaço necessário
            let espaçoNecessario = quantidade * tamanhoAnimal;
            // considera 1 espaço extra quando há mais de uma espécie
            const diferentesEspécies = Object.keys(recinto.animaisExistentes).some(esp => esp !== animalV);
            if (diferentesEspécies) {
                espaçoNecessario++;
            }

            if (espaçoNecessario > tamanhoLivre) continue;
            
            // regras específicas
            if (animalV === 'macaco' && quantidade === 1) continue;

            if (animalV === 'hipopotamo' && !recinto.bioma.includes('savana e rio')) continue;

            if (['leao', 'leopardo', 'crocodilo'].includes(animalV) && 
            Object.keys(recinto.animaisExistentes).length > 0 && 
            !Object.keys(recinto.animaisExistentes).every(a => a === animalV)) continue;

            if (['leao', 'leopardo', 'crocodilo'].includes(animalV)) {
                if (Object.keys(recinto.animaisExistentes).some(a => ['leao', 'leopardo', 'crocodilo'].includes(a))) continue;
            }

            // adicionando o recinto viável
            recintosViaveis.push({
                numero: recinto.numero,
                espaçoLivre: tamanhoLivre - espaçoNecessario,
                espaçoTotal: recinto.tamanhoTotal
            });
        }

        // verifica se há recinto viável
        if (recintosViaveis.length === 0) {
            return {erro: 'Não há recinto viável'};
        }

        // ordena os recintos
        return {
            recintos: recintosViaveis
            .sort((a, b) => a.numero - b.numero)
            .map(r => `Recinto ${r.numero} (espaço livre: ${r.espaçoLivre} total: ${r.espaçoTotal})`)
        }
    }   
}

export { RecintosZoo as RecintosZoo };