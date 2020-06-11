import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { MilestoneCard } from './MilestoneCard';

const onPres = () => {

}

const html1 = `
    <p>Kupanje, spavanje i igra treba da predstavljaju svakodnevnu rutinu. 
    Stavljajte bebu da spava na leđima ili na stranu.</p>
    <p>Vaša beba je u razvojnom periodu upoznavanja. Popunite kratki upitnik za ovaj razvojni period, saznajte više o podršci razvoju svog deteta i pratite kako se vaše dete razvija.</p>
`

const html2 = `
    <p>Održavajte svakodnevnu rutinu: Hranjenje, kupanje, spavanje i igra</p>
`

storiesOf('Milestone Card', module)
    .add('default', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <MilestoneCard
                title="Period upoznavanja"
                subTitle="1. mesec "
                html={html1}
                roundedButton={{ title: 'Popunite upitnik', onPress: onPres }}
                textButton={{ title: 'Vise o razvoju u ovom periodu', onPress: onPres }}
            />
        </View>
    ))
    .add('witouth rounded button ', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <MilestoneCard
                title="Period uspostavljanja rutine i usklađivanja"
                subTitle="2. mesec "
                html={html2}
                textButton={{ title: 'Vise o razvoju u ovom periodu', onPress: onPres }}
            />
        </View>
    ));