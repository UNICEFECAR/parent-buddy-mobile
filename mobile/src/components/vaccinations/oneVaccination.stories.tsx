import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { OneVaccinations } from './oneVaccinations';
import { ScrollView } from 'react-native-gesture-handler';

const dummyData = {

}


storiesOf('oneVaccinations', module)
    .add('default', () => (
        <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <OneVaccinations
                title="Na rođenju"
                isHorizontalLineVisible={true}
                vaccineList={[
                    { complete: true, title: "Protiv tuberkuloze", },
                    { complete: true, title: "Protiv zarazne žutice B", },
                ]}
            />
            <OneVaccinations
                vaccinationDate="21.7.2019."
                vaccineList={[
                    { complete: false, title: "Protiv zarazne žutice B", description: "Vakcina dobijena genetskim inženjeringom, sadrži prečišćeni HbsAg" },
                    { complete: true, title: "Protiv difterije, tetanusa, velikog kašlja - 14.6.2019.", description: "Vakcina koja sadrži toksoide difterije i tetanusa i inaktivisanu korpuskulu Bordetella pertusis" },
                    { complete: true, title: "Protiv dečije paralize", description: "Živa oralna tritipna polio vakcina koja sadrži sva tri tipa živa oslabljena poliovirusa" },
                    { complete: true, title: "Protiv oboljenja izazvanih hemofilusom influence tipa B - 15.5.2019.", description: "Konjugovana vakcina" },
                ]}
                title="5. Mesec"

                isHorizontalLineVisible={true}
            />
            <OneVaccinations 
                vaccinationDate="17. - 24. mesec"
                title="Predstojeća vakcinacija"
                vaccineList={[
                    {complete: false, title: "Protiv zarazne žutice B", description: "Kombinovana vakcina koja sadrži toksoide difterije i tetanusa i inaktivisanu korpuskulu Bordetella pertusis"}
                ]}
            />
        </ScrollView>
    ));